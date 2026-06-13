import numpy as np
from sklearn.metrics.pairwise import cosine_similarity


class SimilarityEngine:
    def __init__(self, vectorizer, job_tfidf_matrix, job_sbert_embeddings=None, df_jobs=None):
        self.vectorizer = vectorizer
        self.job_tfidf_matrix = job_tfidf_matrix
        self.job_sbert_embeddings = job_sbert_embeddings  # shape (n_jobs, dim)
        self.df_jobs = df_jobs.reset_index(drop=True) if df_jobs is not None else None
        self.valid_skill_terms = self._build_valid_skill_terms()
        try:
            self.feature_names = np.array(vectorizer.get_feature_names_out())
        except Exception:
            self.feature_names = np.array([])
        self._sbert_model = None
        self._sbert_attempted = False

    def _build_valid_skill_terms(self) -> set[str]:
        try:
            from pathlib import Path
            import json

            models_dir = Path("models")
            with open(models_dir / "skill_taxonomy.json") as f:
                taxonomy = json.load(f)

            terms = set()
            for skills in taxonomy.values():
                for skill in skills:
                    clean = skill.lower().strip()
                    clean = clean.replace("\\.", ".").replace("\\+", "+")
                    clean = clean.replace("\\#", "#")
                    terms.add(clean)
            return terms
        except Exception:
            return set()

    # Lazy-load SBERT encoder; hanya coba sekali agar tidak spam log
    def _load_sbert(self):
        if self._sbert_attempted:
            return self._sbert_model
        self._sbert_attempted = True
        try:
            from sentence_transformers import SentenceTransformer
            self._sbert_model = SentenceTransformer("all-MiniLM-L6-v2")
            print("[OK] SBERT encoder loaded.")
        except Exception as e:
            # Fallback aman ke TF-IDF saja. Pakai ASCII (hindari crash encoding di Windows).
            print(f"[WARN] SBERT encoder not available, using TF-IDF only: {e}")
        return self._sbert_model

    def get_matches(self, resume_text: str, top_k: int = 10) -> dict:
        # --- TF-IDF similarity ---
        resume_vec = self.vectorizer.transform([resume_text])
        tfidf_scores = cosine_similarity(resume_vec, self.job_tfidf_matrix).flatten()

        # --- SBERT similarity (opsional) ---
        sbert_scores = None
        if self.job_sbert_embeddings is not None:
            sbert_model = self._load_sbert()
            if sbert_model is not None:
                query_emb = sbert_model.encode([resume_text], normalize_embeddings=True)
                sbert_scores = cosine_similarity(query_emb, self.job_sbert_embeddings).flatten()

        # --- Combined score (weighted average) ---
        if sbert_scores is not None:
            combined = 0.6 * tfidf_scores + 0.4 * sbert_scores
        else:
            combined = tfidf_scores

        top_indices = combined.argsort()[::-1][:top_k]

        # --- Kolom metadata dari df_jobs ---
        title_col = None
        skills_col = None
        if self.df_jobs is not None:
            cols = self.df_jobs.columns.tolist()
            title_col = next(
                (c for c in cols if any(k in c.lower() for k in ("title", "role", "position", "career", "occupation"))),
                None,
            )
            skills_col = next(
                (c for c in cols if "skill" in c.lower() and c != title_col), None
            )

        matches = []
        for rank, idx in enumerate(top_indices, 1):
            derived_skills = self._derive_terms(int(idx), limit=4)
            generated_title = "Recommended Career"
            if derived_skills:
                readable_terms = ", ".join(
                    term.replace("_", " ").title() for term in derived_skills[:2]
                )
                generated_title = f"Career Fit for {readable_terms}"

            entry = {
                "rank": rank,
                "job_title": generated_title,
                "match_score_tfidf": round(float(tfidf_scores[idx]), 4),
                "combined_score": round(float(combined[idx]), 4),
                "required_skills": derived_skills,
            }

            if sbert_scores is not None:
                entry["match_score_sbert"] = round(float(sbert_scores[idx]), 4)

            if self.df_jobs is not None and int(idx) < len(self.df_jobs):
                row = self.df_jobs.iloc[int(idx)]
                if title_col:
                    title_value = str(row[title_col]).strip()
                    if title_value and not self._looks_numeric_placeholder(title_value):
                        entry["job_title"] = title_value
                if skills_col:
                    raw = row[skills_col]
                    if isinstance(raw, list):
                        entry["required_skills"] = raw
                    elif isinstance(raw, str):
                        entry["required_skills"] = [s.strip() for s in raw.split(",") if s.strip()]

            matches.append(entry)

        return {"matches": matches, "total_matches": len(matches)}

    def _looks_numeric_placeholder(self, value: str) -> bool:
        cleaned = value.strip().lower()
        return (
            cleaned.isdigit()
            or cleaned.startswith("job #")
            or cleaned.startswith("career #")
        )

    def _derive_terms(self, row_index: int, limit: int = 4) -> list[str]:
        if self.job_tfidf_matrix is None or self.feature_names.size == 0:
            return []

        row = self.job_tfidf_matrix[row_index]
        values = row.toarray().ravel() if hasattr(row, "toarray") else np.asarray(row).ravel()
        if values.size == 0:
            return []

        top_indices = values.argsort()[::-1]
        terms = []
        stop_terms = {
            "and", "or", "to", "for", "of", "the", "a", "an", "in", "on",
            "with", "by", "from", "at", "as", "is", "are", "be", "this", "that",
            "desktop", "network", "job", "role", "team", "work", "using",
        }
        for feature_index in top_indices:
            if values[feature_index] <= 0:
                break
            term = str(self.feature_names[feature_index]).strip()
            normalized = term.lower().strip()
            if (
                term
                and normalized not in terms
                and normalized not in stop_terms
                and (not self.valid_skill_terms or normalized in self.valid_skill_terms)
            ):
                terms.append(term)
            if len(terms) >= limit:
                break

        # Fallback: kalau tidak ada term yang lolos whitelist, ambil term non-stopword
        if not terms:
            for feature_index in top_indices:
                if values[feature_index] <= 0:
                    break
                term = str(self.feature_names[feature_index]).strip().lower()
                if term and term not in stop_terms and len(term) > 2:
                    terms.append(term)
                if len(terms) >= limit:
                    break
        return terms

    # Utilitas: hitung skor antara dua teks (untuk keperluan internal)
    def get_score(self, text_a: str, text_b: str) -> float:
        vecs = self.vectorizer.transform([text_a, text_b])
        return float(cosine_similarity(vecs[0:1], vecs[1:2])[0][0])

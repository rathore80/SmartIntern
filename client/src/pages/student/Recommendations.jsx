import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await api.get("/recommendations");
        setRecommendations(response.data);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Failed to load recommendations"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  if (loading) {
    return <h2>Loading recommendations...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  return (
    <div className="recommendations-page">

      <div className="recommendations-header">
        <h1>Recommended Jobs</h1>

        <p>
          Jobs matched to your skills, experience,
          education, and preferences.
        </p>
      </div>

      {recommendations.length === 0 ? (
        <div className="empty-state">

          <h2>No recommendations available</h2>

          <p>
            Complete your profile to get better
            recommendations.
          </p>

        </div>
      ) : (
        <div className="recommendations-grid">

          {recommendations.map((job) => (

            <div
              className="recommendation-card"
              key={job.jobId}
            >

              {/* Job information */}
              <h2>{job.jobTitle}</h2>

              <h3>{job.company}</h3>


              {/* Overall Match */}
              <div className="overall-match">

                <span>Overall Match</span>

                <span
                  className={`match-score ${
                    job.matchPercentage >= 80
                      ? "high"
                      : job.matchPercentage >= 50
                      ? "medium"
                      : "low"
                  }`}
                >
                  {job.matchPercentage}%
                </span>

              </div>


              {/* Individual Scores */}
              <div className="match-details">

                <p>
                  <strong>Skills:</strong>{" "}
                  {job.skillScore}%
                </p>

                <p>
                  <strong>Experience:</strong>{" "}
                  {job.experienceScore}%
                </p>

                <p>
                  <strong>Education:</strong>{" "}
                  {job.educationScore}%
                </p>

                <p>
                  <strong>Location:</strong>{" "}
                  {job.locationScore}%
                </p>

              </div>


              {/* Reasons */}
              {job.reasons?.length > 0 && (
                <div className="match-reasons">

                  <strong>Why this matches:</strong>

                  <ul>
                    {job.reasons.map(
                      (reason, index) => (
                        <li key={index}>
                          {reason}
                        </li>
                      )
                    )}
                  </ul>

                </div>
              )}


              {/* Details */}
              <Link
                to={`/student/jobs/${job.jobId}`}
                className="job-details-button"
              >
                View Details
              </Link>

            </div>

          ))}

        </div>
      )}

    </div>
  );
};

export default Recommendations;
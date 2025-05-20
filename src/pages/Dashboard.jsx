import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Spinner,
  Alert,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { profileAPI, jobsAPI } from "../services/api";
import { useAuth } from "../contexts/AuthContext";

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [profileLoading, setProfileLoading] = useState(true);
  const [recommendationsLoading, setRecommendationsLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setProfileLoading(true);
        const res = await profileAPI.getProfile();
        setProfile(res.data);
      } catch (err) {
        setError(
          "Failed to load profile. Please create your profile to get job recommendations."
        );
      } finally {
        setProfileLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Handle recommendation button click
  const handleGetRecommendations = async () => {
    try {
      setRecommendationsLoading(true);
      const res = await jobsAPI.getRecommendations();
      setRecommendations(res.data);
    } catch (err) {
      setError("Failed to get recommendations. Please try again later.");
      console.error(err);
    } finally {
      setRecommendationsLoading(false);
    }
  };

  if (profileLoading) {
    return (
      <Container className="d-flex justify-content-center py-5">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  // If no profile exists, show a message
  if (!profile) {
    return (
      <Container className="py-4">
        <Card className="text-center p-5 shadow-sm">
          <Card.Body>
            <h2 className="mb-3">Welcome, {currentUser?.email}</h2>
            <p className="mb-4">
              Please complete your profile to get personalized job
              recommendations.
            </p>
            <Link to="/profile" className="btn btn-primary">
              Create Your Profile
            </Link>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row>
        <Col lg={4} className="mb-4">
          <Card className="shadow-sm h-100">
            <Card.Header className="bg-white">
              <h4 className="mb-0">Your Profile</h4>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <h5>{profile.name}</h5>
                <p className="text-muted mb-0">
                  <i className="bi bi-geo-alt me-1"></i> {profile.location}
                </p>
              </div>

              <div className="mb-3">
                <strong>Experience:</strong> {profile.yearsOfExperience} years
              </div>

              <div className="mb-3">
                <strong>Preferred Job Type:</strong>{" "}
                {profile.preferredJobType.charAt(0).toUpperCase() +
                  profile.preferredJobType.slice(1)}
              </div>

              <div>
                <strong>Skills:</strong>
                <div className="mt-2">
                  {profile.skills.map((skill) => (
                    <Badge key={skill} bg="primary" className="me-1 mb-1">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card.Body>
            <Card.Footer className="bg-white border-top-0">
              <Link to="/profile" className="btn btn-outline-primary btn-sm">
                Edit Profile
              </Link>
            </Card.Footer>
          </Card>
        </Col>

        <Col lg={8}>
          <Card className="shadow-sm mb-4">
            <Card.Header className="bg-white d-flex justify-content-between align-items-center">
              <h4 className="mb-0">AI Job Recommendations</h4>
              <Button
                variant="primary"
                onClick={handleGetRecommendations}
                disabled={recommendationsLoading}
              >
                {recommendationsLoading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    Finding Matches...
                  </>
                ) : (
                  "Find My Matches"
                )}
              </Button>
            </Card.Header>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}

              {recommendations.length === 0 ? (
                <div className="text-center py-5">
                  <p className="text-muted mb-0">
                    {recommendationsLoading
                      ? "Finding your perfect job matches..."
                      : 'Click "Find My Matches" to get personalized job recommendations.'}
                  </p>
                </div>
              ) : (
                <Row>
                  {recommendations.map((rec) => (
                    <Col md={12} className="mb-3" key={rec.id}>
                      <Card className="recommendation-card shadow-sm">
                        <Card.Body>
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <h5 className="mb-1">{rec.title}</h5>
                              <p className="text-muted mb-2">{rec.company}</p>
                            </div>
                            <Badge bg="success" className="match-score">
                              {rec.matchScore}% Match
                            </Badge>
                          </div>

                          <div className="mb-3">
                            <h6 className="text-muted">
                              Why this is a good match:
                            </h6>
                            <ul className="small ps-3">
                              {rec.matchReasons.map((reason, index) => (
                                <li key={index}>{reason}</li>
                              ))}
                            </ul>
                          </div>

                          <div className="mb-3">
                            {rec.jobDetails.skills.map((skill) => (
                              <Badge
                                key={skill}
                                bg={
                                  profile.skills.includes(skill)
                                    ? "success"
                                    : "light"
                                }
                                text={
                                  profile.skills.includes(skill)
                                    ? "white"
                                    : "dark"
                                }
                                className="me-1 mb-1"
                              >
                                {skill}
                              </Badge>
                            ))}
                          </div>

                          <div className="d-flex justify-content-end">
                            <Link
                              to={`/jobs/${rec.id}`}
                              className="btn btn-outline-primary btn-sm"
                            >
                              View Full Details
                            </Link>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;

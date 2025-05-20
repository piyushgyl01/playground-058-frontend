import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Alert,
  Spinner,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { profileAPI } from "../services/api";

// List of skills for multi-select
const skillOptions = [
  "JavaScript",
  "React",
  "Node.js",
  "Express",
  "MongoDB",
  "HTML",
  "CSS",
  "Python",
  "Django",
  "Flask",
  "SQL",
  "PostgreSQL",
  "TypeScript",
  "Vue.js",
  "Angular",
  "AWS",
  "Docker",
  "Kubernetes",
  "Git",
  "Redux",
  "GraphQL",
  "REST API",
  "Java",
  "C#",
  ".NET",
  "PHP",
  "Ruby",
  "Go",
  "Swift",
  "Kotlin",
  "Machine Learning",
  "Data Analysis",
  "Bootstrap",
  "SASS",
];

const ProfileForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    yearsOfExperience: 0,
    skills: [],
    preferredJobType: "any",
  });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const { name, location, yearsOfExperience, skills, preferredJobType } =
    formData;

  // Fetch profile data if it exists
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setFetchLoading(true);
        const res = await profileAPI.getProfile();

        setFormData({
          name: res.data.name || "",
          location: res.data.location || "",
          yearsOfExperience: res.data.yearsOfExperience || 0,
          skills: res.data.skills || [],
          preferredJobType: res.data.preferredJobType || "any",
        });
      } catch (err) {
        // If 404, user doesn't have a profile yet - that's OK
        if (err.response && err.response.status !== 404) {
          setError("Failed to fetch profile");
        }
      } finally {
        setFetchLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSkillChange = (e) => {
    const skill = e.target.value;

    if (e.target.checked) {
      setFormData({
        ...formData,
        skills: [...skills, skill],
      });
    } else {
      setFormData({
        ...formData,
        skills: skills.filter((s) => s !== skill),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (skills.length === 0) {
      return setError("Please select at least one skill");
    }

    try {
      setLoading(true);

      await profileAPI.createProfile(formData);

      setSuccess("Profile saved successfully!");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <Container className="d-flex justify-content-center py-5">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Card className="shadow-sm">
        <Card.Header className="bg-white">
          <h2 className="m-0">Your Professional Profile</h2>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="name">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3" controlId="location">
                  <Form.Label>Location</Form.Label>
                  <Form.Control
                    type="text"
                    name="location"
                    placeholder="City, State/Country"
                    value={location}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="yearsOfExperience">
                  <Form.Label>Years of Experience</Form.Label>
                  <Form.Control
                    type="number"
                    name="yearsOfExperience"
                    min="0"
                    value={yearsOfExperience}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3" controlId="preferredJobType">
                  <Form.Label>Preferred Job Type</Form.Label>
                  <Form.Select
                    name="preferredJobType"
                    value={preferredJobType}
                    onChange={handleChange}
                    required
                  >
                    <option value="remote">Remote</option>
                    <option value="onsite">Onsite</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="any">Any</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-4">
              <Form.Label>Skills (select all that apply)</Form.Label>
              <Card className="p-3">
                <Row xs={1} sm={2} md={3} lg={4}>
                  {skillOptions.map((skill) => (
                    <Col key={skill}>
                      <Form.Check
                        type="checkbox"
                        id={`skill-${skill}`}
                        label={skill}
                        value={skill}
                        checked={skills.includes(skill)}
                        onChange={handleSkillChange}
                        className="mb-2"
                      />
                    </Col>
                  ))}
                </Row>
              </Card>
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button
                variant="secondary"
                className="me-2"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    Saving...
                  </>
                ) : (
                  "Save Profile"
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ProfileForm;

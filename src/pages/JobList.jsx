import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Badge,
  Spinner,
  Alert,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { jobsAPI } from "../services/api";

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    jobType: "all",
    location: "all",
  });

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const res = await jobsAPI.getJobs();
        setJobs(res.data);
      } catch (err) {
        setError("Failed to fetch jobs");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Get unique locations for filter dropdown
  const locations = [
    "all",
    ...new Set(jobs.map((job) => job.location.split(",")[0].trim())),
  ];

  // Filter jobs based on search term and filters
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.skills.some((skill) =>
        skill.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesJobType =
      filters.jobType === "all" || job.jobType === filters.jobType;
    const matchesLocation =
      filters.location === "all" || job.location.includes(filters.location);

    return matchesSearch && matchesJobType && matchesLocation;
  });

  if (loading) {
    return (
      <Container className="d-flex justify-content-center py-5">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h2 className="mb-4">Available Jobs</h2>

      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Row>
            <Col md={6} className="mb-3 mb-md-0">
              <Form.Control
                type="text"
                placeholder="Search jobs by title, company, or skills"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Col>
            <Col md={3} className="mb-3 mb-md-0">
              <Form.Select
                value={filters.jobType}
                onChange={(e) =>
                  setFilters({ ...filters, jobType: e.target.value })
                }
              >
                <option value="all">All Job Types</option>
                <option value="remote">Remote</option>
                <option value="onsite">Onsite</option>
                <option value="hybrid">Hybrid</option>
              </Form.Select>
            </Col>
            <Col md={3}>
              <Form.Select
                value={filters.location}
                onChange={(e) =>
                  setFilters({ ...filters, location: e.target.value })
                }
              >
                {locations.map((location) => (
                  <option key={location} value={location}>
                    {location === "all" ? "All Locations" : location}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {error && <Alert variant="danger">{error}</Alert>}

      {filteredJobs.length === 0 ? (
        <Alert variant="info">
          No jobs match your search criteria. Try adjusting your filters.
          <Button
            variant="link"
            onClick={() => {
              setSearchTerm("");
              setFilters({ jobType: "all", location: "all" });
            }}
          >
            Clear all filters
          </Button>
        </Alert>
      ) : (
        <Row>
          {filteredJobs.map((job) => (
            <Col key={job._id} lg={4} md={6} className="mb-4">
              <Card className="h-100 shadow-sm job-card">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <Card.Title>{job.title}</Card.Title>
                    <Badge
                      bg={
                        job.jobType === "remote"
                          ? "success"
                          : job.jobType === "onsite"
                          ? "primary"
                          : "warning"
                      }
                    >
                      {job.jobType.charAt(0).toUpperCase() +
                        job.jobType.slice(1)}
                    </Badge>
                  </div>

                  <Card.Subtitle className="mb-2 text-muted">
                    {job.company}
                  </Card.Subtitle>

                  <p className="small text-muted mb-2">
                    <i className="bi bi-geo-alt me-1"></i> {job.location}
                  </p>

                  {job.salary && (
                    <p className="small mb-2">
                      <i className="bi bi-cash me-1"></i> {job.salary}
                    </p>
                  )}

                  <Card.Text className="mb-3 text-truncate">
                    {job.description}
                  </Card.Text>

                  <div className="mb-3">
                    {job.skills.slice(0, 4).map((skill) => (
                      <Badge
                        key={skill}
                        bg="light"
                        text="dark"
                        className="me-1 mb-1"
                      >
                        {skill}
                      </Badge>
                    ))}
                    {job.skills.length > 4 && (
                      <Badge bg="light" text="dark">
                        +{job.skills.length - 4} more
                      </Badge>
                    )}
                  </div>

                  <div className="d-grid">
                    <Link
                      to={`/jobs/${job._id}`}
                      className="btn btn-outline-primary btn-sm"
                    >
                      View Details
                    </Link>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default JobList;

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
import { useParams, Link } from "react-router-dom";
import { jobsAPI } from "../services/api";

const JobDetail = () => {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { id } = useParams();

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const res = await jobsAPI.getJobById(id);
        setJob(res.data);
      } catch (err) {
        setError("Failed to fetch job details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  if (loading) {
    return (
      <Container className="d-flex justify-content-center py-5">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
        <Link to="/jobs" className="btn btn-primary">
          Back to Jobs
        </Link>
      </Container>
    );
  }

  if (!job) {
    return (
      <Container className="py-5">
        <Alert variant="warning">Job not found</Alert>
        <Link to="/jobs" className="btn btn-primary">
          Back to Jobs
        </Link>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Card className="shadow-sm">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-start mb-4">
            <div>
              <h2 className="mb-1">{job.title}</h2>
              <p className="text-muted mb-2">{job.company}</p>
              <div className="d-flex align-items-center">
                <Badge
                  bg={
                    job.jobType === "remote"
                      ? "success"
                      : job.jobType === "onsite"
                      ? "primary"
                      : "warning"
                  }
                  className="me-2"
                >
                  {job.jobType.charAt(0).toUpperCase() + job.jobType.slice(1)}
                </Badge>
                <span className="text-muted small">
                  <i className="bi bi-geo-alt me-1"></i>
                  {job.location}
                </span>
              </div>
            </div>
            <Link to="/jobs" className="btn btn-outline-secondary btn-sm">
              Back to Jobs
            </Link>
          </div>

          {job.salary && (
            <div className="mb-4">
              <h5>Salary Range</h5>
              <p>{job.salary}</p>
            </div>
          )}

          <div className="mb-4">
            <h5>Description</h5>
            <p>{job.description}</p>
          </div>

          <div className="mb-4">
            <h5>Required Skills</h5>
            <div>
              {job.skills.map((skill) => (
                <Badge
                  key={skill}
                  bg="light"
                  text="dark"
                  className="me-2 mb-2 p-2"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center">
            <p className="text-muted small mb-0">
              <i className="bi bi-calendar me-1"></i>
              Posted on: {new Date(job.createdAt).toLocaleDateString()}
            </p>
            <Button variant="primary">Apply Now</Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default JobDetail;

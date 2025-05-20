import React from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <div className="bg-primary text-white py-5">
        <Container>
          <Row className="py-5 align-items-center">
            <Col lg={6} className="mb-4 mb-lg-0">
              <h1 className="display-4 fw-bold mb-4">
                Find Your Perfect Job Match
              </h1>
              <p className="lead mb-4">
                Our AI-powered platform analyzes your skills and preferences to
                find the best job matches for you.
              </p>
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="btn btn-light btn-lg px-4 me-3"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <Link to="/register" className="btn btn-light btn-lg px-4 me-3">
                  Get Started
                </Link>
              )}
              <Link to="/jobs" className="btn btn-outline-light btn-lg px-4">
                Browse Jobs
              </Link>
            </Col>
            <Col lg={6}>
              <img
                src="https://images.unsplash.com/photo-1516321497487-e288fb19713f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                alt="Job Search"
                className="img-fluid rounded shadow"
              />
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="py-5">
        <h2 className="text-center mb-5">How It Works</h2>
        <Row>
          <Col md={3} className="mb-4">
            <Card className="h-100 text-center shadow-sm">
              <Card.Body>
                <div className="mb-3 text-primary">
                  <i
                    className="bi bi-person-circle"
                    style={{ fontSize: "3rem" }}
                  ></i>
                </div>
                <Card.Title>Create Profile</Card.Title>
                <Card.Text>
                  Tell us about your skills, experience, and preferences.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} className="mb-4">
            <Card className="h-100 text-center shadow-sm">
              <Card.Body>
                <div className="mb-3 text-primary">
                  <i className="bi bi-search" style={{ fontSize: "3rem" }}></i>
                </div>
                <Card.Title>Browse Jobs</Card.Title>
                <Card.Text>
                  Explore our database of job opportunities.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} className="mb-4">
            <Card className="h-100 text-center shadow-sm">
              <Card.Body>
                <div className="mb-3 text-primary">
                  <i className="bi bi-robot" style={{ fontSize: "3rem" }}></i>
                </div>
                <Card.Title>AI Matching</Card.Title>
                <Card.Text>
                  Our AI analyzes your profile to find the best matches.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} className="mb-4">
            <Card className="h-100 text-center shadow-sm">
              <Card.Body>
                <div className="mb-3 text-primary">
                  <i
                    className="bi bi-check-circle"
                    style={{ fontSize: "3rem" }}
                  ></i>
                </div>
                <Card.Title>Apply</Card.Title>
                <Card.Text>
                  Apply to your matched jobs with confidence.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Home;

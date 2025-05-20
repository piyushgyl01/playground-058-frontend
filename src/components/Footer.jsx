import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const Footer = () => {
  return (
    <footer className="bg-light mt-5 py-4">
      <Container>
        <Row>
          <Col md={6} className="text-center text-md-start">
            <h5>JobMatch AI</h5>
            <p className="text-muted small">
              Find your perfect job with our AI-powered matching system.
            </p>
          </Col>
          <Col md={6} className="text-center text-md-end">
            <p className="text-muted small">
              &copy; {new Date().getFullYear()} JobMatch AI. All rights
              reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;

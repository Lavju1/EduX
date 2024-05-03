import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../UserContext";
import {
  Row,
  Col,
  Form,
  Button,
  Image,
  Card,
  InputGroup,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { HiOutlineUser, HiOutlineUsers } from "react-icons/hi2";
import { HiOutlineMail } from "react-icons/hi";
import { MdAlternateEmail } from "react-icons/md";
import { SlLock } from "react-icons/sl";
import { register, resetRegister } from "../redux/slices/authSlice";

const Register = () => {
  useEffect(() => {
    document.title = `Register `;
  }, []);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.auth);
  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth.register
  );





  const { userData, setUserData } = useContext(UserContext);

  // Now you can use userData and setUserData here
  // For example:
  const handleUpdateUserData = (username, email, password, firstName, lastName) => {
    setUserData({
      username: username,
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName
    });
  };
  const saveCredentialsToLocalStorage = (username, password, email, firstName, lastName) => {
    localStorage.setItem("username", username);
    localStorage.setItem("password", password);
    localStorage.setItem("email", email);
    localStorage.setItem("firstName", firstName);
    localStorage.setItem("lastName", lastName);
    localStorage.setItem("registered", false);
  };



  const onSignup = () => {

    axios
      .post("http://localhost:3001/signup", {
        username,
        password,
        email,
        firstName,
        lastName,
      })
    // .then((r) => props.onAuth({ ...r.data, password })) // NOTE: over-ride secret
    .catch((e) => console.log(JSON.stringify(e.response.data)));
  };




  const handleSubmit = async (e) => {
    e.preventDefault();

    handleUpdateUserData(username, email, password, firstName, lastName)
    if (!username || !email || !password || !firstName || !lastName) return;

    try {
      // onSignup();
      dispatch(register({ username, email, password, firstName, lastName }));
      saveCredentialsToLocalStorage(username, password, email, firstName, lastName)
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    console.log(userData)
  }, [userData])

  useEffect(() => {

    dispatch(resetRegister());
  }, [dispatch]);

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  return (
    <Row className="auth-form justify-content-center">
      <div className="bg-wrapper">
        <div className="bg">
          <Image src="https://res.cloudinary.com/djuxwysbl/image/upload/v1674230232/bg_ywi34h.svg" />
        </div>
      </div>
      <Col className="d-flex align-items-center justify-content-center" lg={6}>
        <Card>
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              {isLoading && <div className="loader"></div>}
              <h3 className="text-center">Register</h3>
              <p className="text-center">
                Welcome to EduX, a platform to connect with the world.
              </p>
              {message && (
                <div
                  className={`message ${isError ? "error" : ""} ${isSuccess ? "success" : ""
                    } ${isLoading ? "info" : ""}`}
                >
                  {message}
                </div>
              )}
              <Form.Group>
                <Form.Label htmlFor="firstName">First Name:</Form.Label>
                <InputGroup className="mb-3">
                  <InputGroup.Text id="basic-addon1">
                    <HiOutlineUser />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    name="firstName"
                    id="firstName"
                    disabled={isLoading}
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </InputGroup>
              </Form.Group>
              <Form.Group>
                <Form.Label htmlFor="lastName">Last Name:</Form.Label>
                <InputGroup className="mb-3">
                  <InputGroup.Text id="basic-addon1">
                    <HiOutlineUsers />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    name="lastName"
                    id="lastName"
                    disabled={isLoading}
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </InputGroup>
              </Form.Group>
              <Form.Group>
                <Form.Label htmlFor="username">Username:</Form.Label>
                <InputGroup className="mb-3">
                  <InputGroup.Text id="basic-addon1">
                    <MdAlternateEmail />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    name="username"
                    id="username"
                    disabled={isLoading}
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </InputGroup>
              </Form.Group>
              <Form.Group>
                <Form.Label htmlFor="email">E-mail Address:</Form.Label>
                <InputGroup className="mb-3">
                  <InputGroup.Text id="basic-addon1">
                    <HiOutlineMail />
                  </InputGroup.Text>
                  <Form.Control
                    type="email"
                    name="email"
                    id="email"
                    disabled={isLoading}
                    placeholder="someone@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </InputGroup>
              </Form.Group>
              <Form.Group>
                <Form.Label htmlFor="password">Password:</Form.Label>
                <InputGroup className="mb-3">
                  <InputGroup.Text id="basic-addon1">
                    <SlLock />
                  </InputGroup.Text>
                  <Form.Control
                    type="password"
                    name="password"
                    id="password"
                    disabled={isLoading}
                    placeholder="***********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </InputGroup>
              </Form.Group>
              <Button
                className="auth-submit mb-4 w-100"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Registering..." : "Register"}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default Register


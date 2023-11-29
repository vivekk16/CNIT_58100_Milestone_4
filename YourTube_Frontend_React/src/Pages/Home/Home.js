import React, { useState, useEffect, useContext } from "react";
import "./Home.css";
import {
  Container,
  Row,
  Col,
  Card,
  Tab,
  Tabs,
  Popover,
  OverlayTrigger,
  Button,
  Alert,
} from "react-bootstrap";
import { useHttpClient } from "../../hooks/http_hook";
import entThumbnail from "../../images/ent_thumbnail.png";
import edThumbnail from "../../images/ed_thumbnail.png";
import { AuthContext } from "../../context/auth_context";

const Home = ({ profile }) => {
  const { sendRequest } = useHttpClient();
  const auth = useContext(AuthContext);
  const [videoData, setVideoData] = useState([{}]);
  const [recommendationsData, setRecommendationData] = useState([{}]);
  const [watchlistData, setWatchlistData] = useState([{}]);
  const [alertShow, setAlertShow] = useState(false);
  const [alertType, setAlertType] = useState("success");

  let alertHeading, alertMessage;

  if (alertType === "success") {
    alertHeading = "Added!";
    alertMessage = "You have successfully added the show to your watchlist.";
  } else {
    alertHeading = "Oh snap! You got an error!";
    alertMessage = "Try again later!";
  }

  const getVideoData = async () => {
    try {
      const responseData = await sendRequest(
        "http://localhost:8000/videos",
        "GET",
        null,
        {
          "Content-Type": "application/json",
        }
      );
      //console.log(responseData);
      setVideoData(responseData);
    } catch (err) {
      console.log(err);
    }
  };

  const handleAddToWatchlist = async (event, item) => {
    event.preventDefault();
    console.log(item);

    try {
      const responseData = await sendRequest(
        "http://localhost:8000/watchlist/add",
        "POST",
        JSON.stringify({
          name: item.name,
          overview: item.overview,
          first_air_date: item.first_air_date,
        }),
        {
          "Content-Type": "application/json",
          Authorization: `Token ${auth.token}`,
        }
      );
      if (responseData.ok) {
        setAlertType("success");
      } else {
        setAlertType("danger");
      }
      setAlertShow(true);
      getWatchlist();
    } catch (err) {
      console.log(err);
    }
  };

  const getWatchlist = async () => {
    try {
      const responseData = await sendRequest(
        "http://localhost:8000/watchlist",
        "GET",
        null,
        {
          "Content-Type": "application/json",
          Authorization: `Token ${auth.token}`,
        }
      );
      setWatchlistData(responseData);
    } catch (err) {
      console.log(err);
    }
  };

  const getRecommendationData = async () => {
    try {
      const bearerToken =
        "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwNjA1OWUwMTc2MGZhYTY4YmNlNzZmNWMyMTI4OTkwMiIsInN1YiI6IjY1NjVmNWJmMTU2Y2M3MDEwY2IzNjYyOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ArykPNtdJEQudkq3aVsXGfo9qxbzvW7ZiAT6lAx7LZ4";
      const responseData = await sendRequest(
        "https://api.themoviedb.org/3/discover/tv?include_adult=false&include_null_first_air_dates=false&language=en-US&page=4&sort_by=popularity.desc",
        "GET",
        null,
        {
          "Content-Type": "application/json",
          Authorization: `Bearer ${bearerToken}`,
        }
      );
      //console.log(responseData.results);
      setRecommendationData(responseData.results);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getVideoData();
    getRecommendationData();
    getWatchlist();
  }, []);

  const filteredData = videoData.filter(
    (item) => item.video_category === profile
  );
  const thumbnail = profile === "Entertainment" ? entThumbnail : edThumbnail;

  const popover = (overview) => (
    <Popover id="popover-basic">
      <Popover.Header as="h3">Show Description</Popover.Header>
      <Popover.Body>{overview ? overview : "Not Available"}</Popover.Body>
    </Popover>
  );

  return (
    <Container>
      <Tabs
        defaultActiveKey="home"
        id="uncontrolled-tab-example"
        className="my-3"
      >
        <Tab eventKey="home" title="Home">
          <Row xs={1} md={2} lg={4}>
            {filteredData.map((item, idx) => (
              <Col key={idx}>
                <Card style={{ width: "18rem", margin: "10px" }}>
                  <Card.Img
                    variant="top"
                    src={thumbnail}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <Card.Body>
                    <Card.Title>{item.title}</Card.Title>
                    <Card.Text style={{ marginBottom: "10px" }}>
                      {item.channel_name}
                    </Card.Text>
                    <Card.Text
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      {item.views} views
                      <span style={{ margin: "0 5px", fontWeight: "bold" }}>
                        ·
                      </span>
                      {item.uploaded_at}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Tab>
        {profile === "Entertainment" && (
          <Tab eventKey="recommendation" title="Show Recommendations">
            <Row xs={1} md={2} lg={4}>
              {recommendationsData.map((item, idx) => (
                <Col key={idx}>
                  <Card style={{ width: "18rem", margin: "10px" }}>
                    <Card.Img
                      variant="top"
                      src={thumbnail}
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                    <Card.Body>
                      <Card.Title>{item.name}</Card.Title>
                      <Card.Text className="my-1">
                        First Aired on : {item.first_air_date}
                      </Card.Text>
                      <Card.Text style={{ marginBottom: "10px" }}>
                        {" "}
                        <OverlayTrigger
                          trigger="click"
                          placement="right"
                          overlay={popover(item.overview)}
                        >
                          <Button variant="danger">Description</Button>
                        </OverlayTrigger>
                        <Button
                          variant="danger"
                          className="mx-1"
                          onClick={(event) => handleAddToWatchlist(event, item)}
                        >
                          + to Watchlist
                        </Button>
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Tab>
        )}
        {profile === "Entertainment" && (
          <Tab eventKey="watchlist" title="Watchlist">
            <Row xs={1} md={2} lg={4}>
              {watchlistData.map((item, idx) => (
                <Col key={idx}>
                  <Card style={{ width: "18rem", margin: "10px" }}>
                    <Card.Img
                      variant="top"
                      src={thumbnail}
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                    <Card.Body>
                      <Card.Title>{item.name}</Card.Title>
                      <Card.Text style={{ marginBottom: "10px" }}>
                        {" "}
                        <OverlayTrigger
                          trigger="click"
                          placement="right"
                          overlay={popover(item.overview)}
                        >
                          <Button variant="danger">Description</Button>
                        </OverlayTrigger>
                       
                      </Card.Text>
                      <Card.Text className="my-1">
                          First Aired on : {item.first_air_date}
                        </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Tab>
        )}
      </Tabs>
      <Alert
        variant={alertType}
        show={alertShow}
        onClose={() => setAlertShow(false)}
        dismissible
      >
        <Alert.Heading>{alertHeading}</Alert.Heading>
        <p>{alertMessage}</p>
      </Alert>
    </Container>
  );
};

export default Home;

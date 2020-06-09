import React from "react";
import axios from "axios";
import "./NewsList.css";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Label,
  ResponsiveContainer,
} from "recharts";

export default class NewsList extends React.Component {
  state = {
    news: [],
    page: 0,
  };

  upvoteClick = (_id) => {
    debugger;
    let Allnews = [...this.state.news];
    let details = localStorage.getItem(_id)
      ? JSON.parse(localStorage.getItem(_id))
      : { voteCount: 0, hide: false };

    details.voteCount = details.voteCount + 1;

    localStorage.setItem(_id, JSON.stringify(details));

    Allnews.find((ele) => {
      return ele.objectID == _id;
    }).voteCount = details.voteCount;
    // console.log(Allnews);

    this.setState({ news: Allnews });
  };
  hideFeed = (_id) => {
    debugger;
    let Allnews = [...this.state.news];
    let details = localStorage.getItem(_id)
      ? JSON.parse(localStorage.getItem(_id))
      : { voteCount: 0, hide: false };

    details.hide = true;

    localStorage.setItem(_id, JSON.stringify(details));

    Allnews.find((ele) => {
      return ele.objectID == _id;
    }).hide = true;

    Allnews = Allnews.filter((elem) => !elem.hide);

    this.setState({ news: Allnews });
  };

  componentDidMount() {
    this.paginate();
  }
  constructRows(story) {
    let flag = story.hide;
    if (!flag) {
      return (
        <tr key={story.objectID}>
          <td>{story.num_comments}</td>
          <td>{story.voteCount}</td>
          <td
            style={{ fontSize: "25px", fontWeight: "800", cursor: "pointer" }}
            onClick={() => this.upvoteClick(story.objectID)}
          >
            ^
          </td>
          <td>
            <span>{story.title}</span>
            <span style={{ color: "lightgray", marginLeft: "2px" }}>
              ({story.url ? story.url.split("//")[1].split("/")[0] : ""}) by
            </span>
            <span style={{ marginLeft: "5px" }}>{story.author}</span>
            <span>
              {/* {new Date(new Date().getTime() - story.created_at_i)} */}
            </span>
            <span
              style={{ marginLeft: "5px", cursor: "pointer" }}
              onClick={() => this.hideFeed(story.objectID)}
            >
              [hide]
            </span>
          </td>
        </tr>
      );
    }
  }

  paginate(flag) {
    let page = this.state.page;
    if (flag === "next") {
      page += 1;
    } else if (flag === "previous") {
      page -= 1;
    }
    this.setState({ page: page });
    axios.get("https://hn.algolia.com/api/v1/search?page=" + page).then(
      (res) => {
        let data = res.data || [],
          newState = [];

        for (let i = 0, len = data["hits"].length; i < len; i++) {
          let details = localStorage.getItem(data["hits"][i]["objectID"])
            ? JSON.parse(localStorage.getItem(data["hits"][i]["objectID"]))
            : { voteCount: 0, hide: false };

          data["hits"][i].voteCount = details.voteCount;
          data["hits"][i].hide = details.hide;
          if (data["hits"][i].hide == false) {
            newState.push(data["hits"][i]);
          }
        }
        this.setState({ news: newState });
      },
      (err) => {
        console.error("Error in Fetching Response: ", err);
      }
    );
  }

  render() {
    return (
      <div>
        <table>
          <tbody>
            <tr>
              <th>comments</th>
              <th>Vote Counts</th>
              <th>UpVote</th>
              <th>News Details</th>
            </tr>
            {this.state.news.map((story) => this.constructRows(story))}
          </tbody>
        </table>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            width: "100%",
          }}
        >
          <button
            disabled={this.state.page == 0}
            onClick={() => this.paginate("previous")}
            style={{
              color: "#ff742b",
              cursor: "pointer",
              border: "none",
              background: "none",
            }}
          >
            Previous
          </button>
          <span
            style={{ color: "#ff742b", marginLeft: "5px", marginRight: "5px" }}
          >
            {" "}
            |{" "}
          </span>
          <button
            onClick={() => this.paginate("next")}
            style={{
              color: "#ff742b",
              cursor: "pointer",
              border: "none",
              background: "none",
            }}
          >
            {" "}
            Next{" "}
          </button>
        </div>
        <hr style={{ border: "2px solid #ff742b", margin: "10px 0 10px 0" }} />
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <LineChart
              width={700}
              data={this.state.news}
              margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
            >
              <Line type="monotone" dataKey="voteCount" stroke="#8884d8" />
              <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
              <XAxis dataKey="objectID">
                <Label value="ID" offset={-5} position="insideBottom" />
              </XAxis>
              <YAxis
                label={{
                  value: "Votes",
                  angle: -90,
                  position: "insideLeft",
                  textAnchor: "middle",
                }}
              />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }
}

import React from "react";
import logo from "./logo.svg";

import NewsList from "./NewsList/NewsList";
function App() {
  return (
    <div className="App">
      {/* <table>
        <thead>
          <th>comments</th>
          <th>Vote Counts</th>
          <th>UpVote</th>
          <th>News Details</th>
        </thead>
        <tbody></tbody>
      </table> */}

      <NewsList />
    </div>
  );
}

export default App;

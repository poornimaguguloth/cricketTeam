const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const path = require("path");

const app = express();
//app.use(express.json());

const dbPath = path.join(__dirname, "cricketTeam.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

//GET API1

app.get("/players/", async (request, response) => {
  const getPlayersQuery = `
    SELECT *
    FROM cricket_team
    ORDER BY player_id;
    `;
  const playersArray = await db.all(getPlayersQuery);

  const convertDbObjectToResponseObject = (dbObject) => {
    return {
      playerId: dbObject.player_id,
      playerName: dbObject.player_name,
      jerseyNumber: dbObject.jersey_number,
      role: dbObject.role,
    };
  };

  response.send(
    playersArray.map((eachPlayer) =>
      convertDbObjectToResponseObject(eachPlayer)
    )
  );
});
rr;
// GET API2

app.post("/players/", async (request, response) => {
  const playersDetails = request.body;
  const { playerId, playerName, jerseyNumber, role } = playersDetails;

  const addPlayersQuery = `
    INSERT INTO 
    cricket_team ( playerName, jerseyNumber, role ) 
    VALUES (
        '${playerName}',
        '${jerseyNumber}',
        '${role}'
    )`;

  const dbResponse = await db.run(addPlayersQuery);
  const playerId = dbResponse.lastId;
  response.send("Player Added to Team");
});
// GET API3

app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getPlayerQuery = `
    SELECT 
    *
    FROM 
    cricket_team
    WHERE
     player_id = ${playerId};`;

  let player = await db.get(getPlayerQuery);
  const newObject = {
    playerId: player.player_id,
    playerName: player.player_name,
    jerseyNumber: player.jersey_number,
    role: player.role,
  };

  response.send(newObject);
});

//  API 4

app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;

  const updatePlayerQuery = `
    UPDATE 
    cricket_team 
    SET 
    playerName = '${playerName}',
    jerseyNumber = '${jerseyNumber}'.
    role = '${role}'
    WHERE 
    player_id = ${playerId}; 
    `;
  await db.run(updatePlayerQuery);
  response.send("Player Details Updated");
});

// API5

app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deletePlayerQuery = `
    DELETE FROM
    cricket_team 
    WHERE player_id = ${playerId};`;
  await db.run(deletePlayerQuery);
  response.send("Player Removed");
});
module.exports = app;

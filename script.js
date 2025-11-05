body {
  font-family: Arial, sans-serif;
  text-align: center;
  background-color: #222;
  color: white;
}

#game {
  margin: 50px auto;
  width: 90%;
  max-width: 600px;
}

button {
  background-color: #444;
  color: white;
  border: none;
  padding: 10px 15px;
  margin: 5px;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.1s ease;
}

button:hover {
  background-color: #555;
}

button:active {
  transform: scale(0.95);
}

.hidden {
  display: none;
}

#adminPanel {
  border: 2px solid red;
  background-color: black;
  color: red;
  padding: 10px;
  margin-top: 20px;
}

#adminPanel button {
  border: 1px solid red;
  color: red;
  background-color: #111;
}

#upgrades {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

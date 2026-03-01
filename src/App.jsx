import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Container, Paper, TextField, Grid, Button } from "@mui/material";
import './App.css'


function App() {
  const [display, setDisplay] = useState("0");
  const [overwrite, setOverwrite] = useState(true);
  const [preValue, setPreValue] = useState(0);
  const [pendingOp, setPendingOp] = useState("");
  const [carryOp, setCarryOp] = useState("");
  const [waitingForNext, setWaitingForNext] = useState(false);
  const [lastOp, setLastOp] = useState("");
  const [stack, setStack] = useState([]);
  const [precedence] = useState([["+", "-"], ["x", "÷"]]);

  const push = (number) => {
  // Use the spread operator to create a new array with the new number added to the end
  setStack(prevStack => [...prevStack, number]);

  const pop = () => {
  setStack(prevStack => {
    // Create a copy of the array
    const newStack = [...prevStack];
    // Remove the last element (LIFO behavior)
    newStack.pop();
    // Return the new array to update the state
    return newStack;
      });
    };
  };

function formatCalcNumber(num, maxSig = 9, sciLimit = 9) {
  if (!Number.isFinite(num)) return String(num);

  let rounded = Number(num.toPrecision(maxSig));

  let str = rounded.toString();

  if (str.includes(".") && !str.includes("e")) {
    str = str.replace(/(\.\d*?)0+$/, "$1").replace(/\.$/, "");
  }

  const digitCount = str
    .replace("-", "")
    .replace(".", "")
    .replace(/e.*$/, "")
    .length;

  if (digitCount > sciLimit) {
    str = rounded.toExponential(maxSig - 1);
  }

  return str;
}


  const arithmetic = (op, print) => {
      const second = stack.pop();
      const first = stack.pop();
      if (op === "+")
        { 
          setPreValue(second);
          const result = first+second;
          if (print) setDisplay(formatCalcNumber(result));
          stack.push(first + second);
        }
      if (op === "-")
         {
          setPreValue(second);
          const result = first-second;
          if (print) setDisplay(formatCalcNumber(result));
          stack.push(first - second);
         }
      if (op === "x") 
        {
          setPreValue(second);
          const result = first*second;
          if (print) setDisplay(formatCalcNumber(result));
          stack.push(first * second);
        }
      if (op === "÷") 
        {
          setPreValue(second);
          const result = first/second;
          if (print) setDisplay(formatCalcNumber(result));
          stack.push(first / second);
        }

  }

  const handleOperator = (key) => {
    setOverwrite(true);
    if (preValue != 0) setPreValue(+display);
   
    if (key === "+" && pendingOp === "")
    {
      if (!waitingForNext) stack.push(+display);
      setPendingOp(key);
    }
    else if (key === "-" && pendingOp === "") 
    {
      if (!waitingForNext) stack.push(+display);
      setPendingOp(key);
    }
    else if (key === "x" && pendingOp === "") 
    {
      if (!waitingForNext) stack.push(+display);
      setPendingOp(key);
    }
    else if (key === "÷" && pendingOp === "")
    { 
      if (!waitingForNext) stack.push(+display);
      setPendingOp(key);
    }
    else
    {
      if (precedence[0].includes(key) || precedence[1].includes(pendingOp) && precedence[1].includes(key))
      {
        if (!waitingForNext) stack.push(+display);
        if (carryOp === "") arithmetic(pendingOp, true);
        else if (precedence[0].includes(key))
        {
          arithmetic(pendingOp, false);
          arithmetic(carryOp, true);
          setCarryOp("");
        }
        else
        {
          arithmetic(pendingOp, true);
        }
        setPendingOp(key);
      }
      else
      {
        setCarryOp(pendingOp);
        setPendingOp(key);
        stack.push(+display);
      }
    }
    setLastOp(key);
    if (waitingForNext) setWaitingForNext(false);
    return;
  }

  const handleDigit = (d) => {
    setDisplay((prev) => {
      if (overwrite || prev === "0") return d;
      return prev + d;
    });
    setOverwrite(false);
  }

  const handleEqual = () => {
    if (!waitingForNext) 
    {
      stack.push(+display);
      if (carryOp != "")
      { 
        arithmetic(pendingOp, false);
        arithmetic(carryOp, true);
      }
      else
      {
        arithmetic(pendingOp, true);
      }
      setPendingOp("");
      setCarryOp("");
      setWaitingForNext(true);
    }
    else
    {
      // repeat euqal directly;
      stack.push(preValue);
      arithmetic(lastOp, true);
    }
  }

  const handleDecimal = () => {
    setDisplay((prev) => {
      if (overwrite) return "0.";
      if (prev.includes(".")) return prev;
      return prev + ".";
    });
    setOverwrite(false);
  }

  const handleClear = () => {
    setDisplay("0");
    setOverwrite(true);
    setPendingOp("");
    setPreValue(0);
    setLastOp("");
    setCarryOp("");
    setStack([]);
    setWaitingForNext(false);
  };

  const handleKeyPress = (key) => {
    if (key === "AC") return handleClear();
    if (key === ".") return handleDecimal();
    if (key === "+" || key === "x" || key === "÷" || key === "-") return handleOperator(key);
    if (key === "=") return handleEqual();
    return handleDigit(key); //later add operators
  }

  const keys = ["7","8","9","÷",
                "4","5","6","x",
                "1","2","3","-",
                "0",".","=","+",
                "AC"];

  return (
    <Container maxWidth="xs">
      <Paper className="calculator" elevation={0}>
        
        {/* Screen */}
          <TextField
          value={display}
          variant="standard"
          fullWidth
          slotProps = {{
            readOnly: true,
            input: {disableUnderline: true},
            
          }}
          sx={{
           
            "& .MuiInputBase-input": {
              textAlign: "right",
              fontSize: "2rem",
              fontWeight: 600,
              color: "#fff",
              backgroundColor: "#000",
              paddingRight: "35px"
            }
          }}
        />

        {/* Buttons Grid */}
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {keys.map((item, index) => (
            <Grid item xs={3} key={index}>
              <Button
                fullWidth
                variant="contained"
                className="calc-button"
                onClick={() => handleKeyPress(item)}
                sx={{
                  width: 70,
                  height: 70,
                  borderRadius: "50%",
                  fontSize: "1.5rem",
                  minWidth: 0,
                  backgroundColor:
                    item === "AC"
                      ? "#a5a5a5"
                      : ["+", "-", "x", "÷", "="].includes(item)
                      ? "#ff9500"
                      : "#333",
                  color:
                    item === "AC"
                      ? "black"
                      : "white",
                  "&:hover": {
                    backgroundColor:
                      item === "AC"
                        ? "#bdbdbd"
                        : ["+", "-", "x", "÷", "="].includes(item)
                        ? "#ffb347"
                        : "#444"
                  }
  }}
              >
                {item}
              </Button>
            </Grid>
          ))}
        </Grid>

      </Paper>
    </Container>
  );
}


export default App

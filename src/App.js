import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [list, setList] = useState([]);
  const [cost, setCost] = useState(0);
  const [flag, setFlag] = useState(false);
  const [itemId, setItemId] = useState("");
  const [message, setMessage] = useState("");
  const [result, setResult] = useState("");

  const getList = () => {
    return Promise.resolve(
      fetch("http://tsg-vending.herokuapp.com/items").then((data) =>
        data.json()
      )
    );
  };

  const getNewItem = () => {
    return Promise.resolve(
      fetch("http://tsg-vending.herokuapp.com/money/" + cost + "/item/" + itemId,{
        method: "POST"
      })
      .then((data) =>  data.json())
    )
  }

  const addDollar = () => {
    setCost(Number(cost) + 1);
  };

  const addQuarter = () => {
    setCost(Number(cost) + 0.25);
  };

  const addDime = () => {
    setCost((Number(cost) + 0.1).toFixed(2));
  };

  const addNickel = () => {
    setCost((Number(cost) + 0.05).toFixed(2));
  };

  const selectItem = (key, id) => {
    setFlag(key);
    setItemId(id);
    setCost(0);
    setMessage("");
    setResult("");
  };

  const purchase = () => {
    getNewItem().then((subItems) => {
      getList().then((items) => {
        setList(items);
      })
      if(subItems.message){
        setMessage(subItems.message);
      }else{
        setMessage("Thank You!!!");
        var price = 0;
        for(var i = 0; i < list.length; i++){
          if(list[i].id == itemId){
            price = list[i].price;
          }
        }
        console.log(price)
        var b_c = Number(cost) - Number(price);
        var dollars = parseInt(b_c);
        var quarters = parseInt((b_c - dollars) / 0.25);
        var dimes = parseInt((b_c - dollars - quarters * 0.25) / 0.1);
        var nickels = parseInt((b_c - dollars - quarters * 0.25 - dimes * 0.1) / 0.05);
        var pennies = parseInt((b_c - dollars - quarters * 0.25 - dimes * 0.1 - nickels * 0.05) / 0.01);
        var results = (dollars > 0 ? dollars + " Dollars," : "") + (quarters > 0 ? quarters + " Quarters," : "") + (dimes > 0 ? dimes + " Dimes," : "") + (nickels > 0 ? nickels + " Nickels," : "") + (pennies > 0 ? pennies + " Pennies," : "") + (b_c > 0 ? "b/c Price is " + b_c : "");
        setResult(results);
      }
    })
  }

  const changeReturn = () => {
    setCost(0);
    setMessage("");
    setItemId("");
    setResult("");
  }

  useEffect(() => {
    getList().then((items) => {
      setList(items);
    });
  }, []);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="w-100 header mx-4">
          <p className="h1 text-center p-3 text-dark font-weight-bold">
            Vending Machine
          </p>
        </div>
        <div className="row w-100 p-5">
          <div className="col-sm-8 left-content">
            <div className="row">
              {list &&
                list.map((item, key) => {
                  return (
                    <div className="col-lg-4 col-md-6 col-sm-12" key={key}>
                      <div
                        className="card mt-4"
                        onClick={() => selectItem(key, item.id)}
                      >
                        <div className="card-body">
                          <p className="item_id font-weight-bold">{item.id}</p>
                          <input
                            type="checkbox"
                            value={item.id}
                            className="state"
                            checked={key == flag ? true : false}
                            disabled
                          />
                          <p className="text-center item_name font-weight-bold">
                            {item.name}
                          </p>
                          <p className="text-center item_price font-weight-bold">
                            <span className="currency">$ </span>
                            <span className="price">{item.price}</span>
                          </p>
                          <p className="text-center font-weight-bold">
                            Quantity Left:
                            <span className="quantity">{item.quantity}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
          <div className="col-sm-4 px-5">
            <div className="right_item">
              <div className="row">
                <div className="w-100">
                  <p className="h3 text-center py-3 m-0">Total $ In</p>
                  <input
                    type="text"
                    id="amount"
                    className="form-control mx-auto mb-2 w-50"
                    placeholder="0.00"
                    value={cost}
                    readOnly
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 px-3">
                  <button
                    className="btn btn-secondary w-100 my-2"
                    id="dollar"
                    value="dollar"
                    onClick={addDollar}
                  >
                    Add Dollar
                  </button>
                  <button
                    className="btn btn-secondary w-100 my-2"
                    id="dime"
                    value="dime"
                    onClick={addDime}
                  >
                    Add Dime
                  </button>
                </div>
                <div className="col-md-6 px-3">
                  <button
                    className="btn btn-secondary w-100 my-2"
                    id="quarter"
                    value="quarter"
                    onClick={addQuarter}
                  >
                    Add Quarter
                  </button>
                  <button
                    className="btn btn-secondary w-100 my-2"
                    id="nickel"
                    value="nickel"
                    onClick={addNickel}
                  >
                    Add Nickel
                  </button>
                </div>
              </div>
            </div>
            <div className="divider"></div>
            <div className="right_item">
              <div className="row">
                <div className="w-100">
                  <p className="h3 text-center py-3 m-0">Messages</p>
                  <div className="d-flex mt-2">
                    <div className="mx-auto">
                      <input
                        type="text"
                        id="message"
                        className="form-control mx-auto mb-2"
                        value={message}
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="d-flex mt-2">
                    <div className=" mx-auto">
                      <label
                        htmlFor="purchase_item"
                        className="font-weight-bold text-secondary"
                      >
                        Item :
                      </label>
                      <input
                        type="text"
                        id="purchase_item"
                        className="form-control"
                        value={itemId}
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="d-flex mt-2">
                    <button
                      className="btn btn-secondary w-50 mx-auto my-2"
                      id="purchase"
                      onClick={purchase}
                    >
                      Make Purchase
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="divider"></div>
            <div className="right_item">
              <div className="row">
                <div className="w-100 mt-3">
                  <p className="h3 text-center py-3 m-0">Change</p>
                  <input
                    type="text"
                    className="form-control mx-auto my-2 change_result w-75"
                    value={result}
                    readOnly
                  />
                  <div className="d-flex">
                    <button
                      className="btn btn-secondary w-50 mx-auto my-2"
                      id="change"
                      onClick={changeReturn}
                    >
                      Change Return
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="divider"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

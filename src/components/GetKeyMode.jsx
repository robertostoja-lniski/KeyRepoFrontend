import { useState } from "react";
import "./QrepoForm.css";
import ArgInput from "./ArgInput.jsx";
const jwt = require('jsonwebtoken');

export default function RemoveKeyForm() {

  const [values, setValues] = useState({
    key_id: "",
    system_password: "",
    partition_password: "",
  });

  const inputs = [
    {
      id: 1,
      name: "key_id",
      type: "text",
      placeholder: "Key id",
      errorMessage:
        "Key identificator is a numeric unique value assigned to a resouce",
      label: "Key id",
      pattern: "^(0|[1-9][0-9]*)$",
      required: true,
    },
    {
      id: 2,
      name: "system_password",
      type: "password",
      placeholder: "System password",
      errorMessage: "Unique password to encrypt partition",
      label: "System password",
      required: true,
    },
  ];

  const handleSubmit = async (e) => {

    console.log('Submited!')
    e.preventDefault();
    try {

      let secretKey = process.env.REACT_APP_JWT_SECRET;
      let data = {
        key_id: values['key_id'],
        system_pass: values['system_password']
      }

      const token = jwt.sign(data, secretKey)
      console.log('Chosen values: ' + values)

      let fullUrl = "http://127.0.0.1:5000/getKeyMode?protected_data=" + token
      console.log('Sending GET to: ' + fullUrl)

      let res = await fetch(fullUrl, 
      { method: "GET" },
      );
      let resJson = await res.json();
      // status 200 means proper communication with backend
      if (res.status === 200) {
        console.log(resJson)
        setValues({ ...values, [e.target.name]: e.target.value });

        var result = resJson['result']
        if (result === 'failed') {
          alert('Operation failed. Check logs for more info')
        } else {
          var answerCode = resJson['qrepo_code']
          if (answerCode === 0) {
            alert('Key modes are ' + resJson['modes'])
          } else {
            alert('Failure! Qrepo answered with error code: ' + answerCode)
          }
        }

      } else {
        console.log('Removing key failed');
        alert('Failed to remove key: ' + e.target[0].value);
      }
    } catch (err) {
      console.log(err);
      alert('Backend not active or wrong address');
    }


  };

  const handleChange = (e) => {
    console.log('Changed!')
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  return (
    <div className="general-form">
        {
          <form onSubmit={handleSubmit}>
            <h1>Get Key Mode</h1>
            {inputs.map((input) => (
              < ArgInput
                key={input.id}
                {...input}
                value={values[input.name]}
                onChange={handleChange}
              />
            ))}
            <button>Submit</button>
          </form>
        }
    </div>
  );
};


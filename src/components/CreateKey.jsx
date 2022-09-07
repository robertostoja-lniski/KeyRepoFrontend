import { useState } from "react";
import "./QrepoForm.css";
import ArgInput from "./ArgInput.jsx";
const jwt = require('jsonwebtoken');

export default function RemoveKeyForm() {

  const [values, setValues] = useState({
    key_len: "",
    system_password: "",
    partition_password: "",
  });

  const inputs = [
    {
      id: 1,
      name: "key_len",
      type: "text",
      placeholder: "Key length",
      errorMessage:  "Keys length",
      label: "Key length",
      pattern: "^(0|[1-9][0-9]*)$",
      required: true,
    },
    {
      id: 2,
      name: "system_password",
      type: "password",
      placeholder: "System password",
      errorMessage: "Unique password to enter partition",
      label: "System password",
      required: true,
    },
    {
        id: 3,
        name: "partition_password",
        type: "password",
        placeholder: "Partition password",
        errorMessage: "Unique password to encrypt partition",
        label: "Partition password",
        required: true,
      },
  ];

  const handleSubmit = async (e) => {

    console.log('Submited!')
    e.preventDefault();
    try {

      let secretKey = process.env.REACT_APP_JWT_SECRET;
      let requestId = Math.floor((Math.random() * 10000000) + 1);
      
      let prvPath = '/tmp/' + + requestId.toString() + "_pem"
      let pubPath = '/tmp/' + + requestId.toString() + ".pem"

      let data = {
        system_pass: values['system_password'],
        partition_pass: values['partition_password'],
        key_path: prvPath,
        pub_key_path: pubPath
      }

      const token = jwt.sign(data, secretKey)
      console.log('Chosen values: ' + values)

      let fullUrl = "http://127.0.0.1:5000/createKeys?protected_data=" + token + "&key_len=" + values['key_len'] + "&algo=RSA"
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
            alert('Keys created! Pub key:' + pubPath + ' Prv key: ' + prvPath)
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
            <h1>Create RSA key pair</h1>
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


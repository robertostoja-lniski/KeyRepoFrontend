import { useState } from "react";
import "./QrepoForm.css";
import ArgInput from "./ArgInput.jsx";
const jwt = require('jsonwebtoken');

export default function RemoveKeyForm() {

  const [values, setValues] = useState({
    pub_key_path: "",
    signature: "",
    partition_password: "",
    message: "",
  });

  const inputs = [
    {
      id: 1,
      name: "pub_key_path",
      type: "text",
      placeholder: "Pub key",
      errorMessage:
        "Path to key with public file",
      label: "Pub key",
      required: true,
    },
    {
        id: 2,
        name: "partition_password",
        type: "password",
        placeholder: "Partition password",
        errorMessage: "Unique password to encrypt partition",
        label: "Partition password",
        required: true,
    },
    {
        id: 3,
        name: "message",
        type: "text",
        placeholder: "Path to message",
        errorMessage: "System path",
        label: "Path to message",
        required: true,
    },
    {
        id: 4,
        name: "signature",
        type: "text",
        placeholder: "Path to existing signature",
        errorMessage: "System path",
        label: "Path to existing signature",
        required: true,
    },
  ];

  const handleSubmit = async (e) => {

    console.log('Submited!')
    e.preventDefault();

    try {

      let secretKey = process.env.REACT_APP_JWT_SECRET;
      let data = {
        pub_key_path: values['pub_key_path'],
        partition_pass: values['partition_password'],
        plain_file: values['message'],
        signature: values['signature'],
      }

      const token = jwt.sign(data, secretKey)
      console.log('Chosen values: ' + values)

      let fullUrl = "http://127.0.0.1:5000/checkSignature?protected_data=" + token
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
          alert('Check signature status: ' + resJson['qrepo_code'])
        }

      } else {
        console.log('Removing key failed');
        alert('Failed to sign: ' + e.target[0].value);
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
            <h1>Check Signature</h1>
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


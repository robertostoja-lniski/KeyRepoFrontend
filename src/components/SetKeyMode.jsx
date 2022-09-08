import { useState } from "react";
import "./QrepoForm.css";
import ArgInput from "./ArgInput.jsx";
const jwt = require('jsonwebtoken');

export default function RemoveKeyForm() {

  const [values, setValues] = useState({
    key_id: "",
    user_acl: "",
    group_acl: "",
    other_acl: "",
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
      errorMessage: "Unique password to enter partition",
      label: "System password",
      required: true,
    },
    {
        id: 3,
        name: "user_acl",
        type: "text",
        placeholder: "User access",
        errorMessage: "use: rwx- syntax",
        label: "User access",
        pattern: "(r?w?x?-?)",
        required: true,
    },
    {
        id: 4,
        name: "group_acl",
        type: "text",
        placeholder: "Group access",
        errorMessage: "use: rwx- syntax",
        label: "Group access",
        pattern: "(r?w?x?-?)",
        required: true,
    },
    {
        id: 5,
        name: "other_acl",
        type: "text",
        placeholder: "Other access",
        errorMessage: "use: rwx- syntax",
        label: "Other access",
        pattern: "(r?w?x?-?)",
        required: true,
    },
  ];

  function toNum(acl) {

    if (acl.length === 4) {
        alert('Wrong acl')
    }

    let result = 0;    
    if (acl.indexOf('r') > -1) {
        result += 4;
    }

    if (acl.indexOf('w') > -1) {
        result += 2;
    }

    if (acl.indexOf('x') > -1) {
        result += 1;
    }

    return result;
  }

  const handleSubmit = async (e) => {

    console.log('Submited!')
    e.preventDefault();

    var userAclNum = toNum(values['user_acl'])
    console.log('User num acl: ' + userAclNum)

    var groupAclNum = toNum(values['group_acl'])
    console.log('Group num acl: ' + groupAclNum)

    var otherAclNum = toNum(values['other_acl'])
    console.log('Other num acl: ' + otherAclNum)

    try {

      let secretKey = process.env.REACT_APP_JWT_SECRET;
      let data = {
        key_id: values['key_id'],
        modes: userAclNum * 100 + groupAclNum * 10 + otherAclNum,
        system_pass: values['system_password']
      }

      const token = jwt.sign(data, secretKey)
      console.log('Chosen values: ' + values)

      let fullUrl = "http://127.0.0.1:5000/setKeyMode?protected_data=" + token
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
            alert('Key modes successfully changed!')
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
            <h1>Set Key Mode</h1>
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


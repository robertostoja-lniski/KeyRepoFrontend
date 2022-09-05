import { useState } from "react";
import "./QrepoForm.css";
import ArgInput from "./ArgInput.jsx";

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
    console.log(values)
    e.preventDefault();
    alert('Trying to remove key: ' + e.target[0].value);
    console.log(values)
    e.preventDefault();
    try {
      let res = await fetch("http://localhost:5001/removeKey", {
        method: "POST",
        body: JSON.stringify({
          id: e.target[0].value,
        }),
      });
      let resJson = await res.json();
      if (res.status === 200) {
        console.log('Removing key succeeded');
        console.log(resJson)
        console.log(values)
        console.log('Setting values')
        setValues({ ...values, [e.target.name]: e.target.value });
        console.log('Values set!')
        console.log(values)
        console.log('Submitting')
        console.log(values)
        console.log('BAM')
        console.log(values)

      } else {
        console.log('Removing key failed');
      }
    } catch (err) {
      console.log(err);
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
            <h1>Remove Key</h1>
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


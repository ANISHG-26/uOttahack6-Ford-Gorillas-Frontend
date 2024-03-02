import React, { useState } from 'react';

const SimpleFormApp = () => {
  // State to store input values
  const [input1, setInput1] = useState('');
  const [input2, setInput2] = useState('');

  const fetchData = async () => {
    try {
      // Make a GET request to the API
      const response = await fetch('http://172.20.10.3:8000/ev_tracker?start_address='+ input1 + '&' +  'end_address=' + input2);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Parse the response as JSON
      const result = await response.json();
      console.log(result);
    } catch (err) {
      console.log('error')
    } finally {
      console.log('error')
    }
  }


  // Event handler for form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData();
    // Perform actions with the input values (you can customize this part)
    console.log('Form submitted with values:', input1, input2);
  };

  return (
    <div>
      <h1>Route Planner</h1>
      <form onSubmit={handleSubmit}>
        {/* Input Form 1 */}
        <label>
          From: 
          <input
            type="text"
            value={input1}
            onChange={(e) => setInput1(e.target.value)}
          />
        </label>
        <br />

        {/* Input Form 2 */}
        <label>
          To:
          <input
            type="text"
            value={input2}
            onChange={(e) => setInput2(e.target.value)}
          />
        </label>
        <br />

        {/* Submit Button */}
        <button disabled= {input1 === '' || input2 === '' ? true : false} type="submit">Submit</button>
      </form>
    </div>
  );
};

export default SimpleFormApp;
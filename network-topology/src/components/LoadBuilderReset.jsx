const LoadBuilderReset = ({ onYes, onNo }) => {
  return <div>
    You are deleting the Load profile Data, <br />
    All the Load profile data will be reset.<br />
    <br />
    Please Confirm <br />
    <button onClick={onYes}>Yes</button><br />
    <button onClick={onNo}>No</button>
  </div>
}

export default LoadBuilderReset;

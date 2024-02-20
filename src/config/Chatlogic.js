export const getSender = (loggedUser, users) => {
  return users[0]?._id === loggedUser?._id ? users[1].name : users[0].name;
};

export const getPic = (loggedUser, users) => {
  return users[0]?._id === loggedUser?._id ? users[1].pic : users[0].pic;
};
export const fullSender = (loggedUser,users)=>{
  return users[0]._id === loggedUser._id ? users[1] :users[0];
}

export const convertTimestampToTime=(timestamp)=> {
  const date = new Date(timestamp);
  
  let hours = date.getHours();
  const minutes = date.getMinutes();
  
  const ampm = hours >= 12 ? 'pm' : 'am';
  
  hours = hours % 12;
  hours = hours ? hours : 12; // If hours is 0, set it to 12 (12-hour clock)
  
  const formattedTime = `${hours}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`;
  
  return formattedTime;
}

// Example usage:

// (messages)
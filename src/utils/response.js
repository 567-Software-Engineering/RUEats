const response = (
  res,
  { data = {}, status = 200, contentType = "application/json" }
) => {
  res.writeHead(status, { "Content-Type": contentType });

  if(contentType === 'text/html'){
    res.write(data);
  }
  else {
    res.write(JSON.stringify(data));
  }
  res.end();
};

module.exports = response;

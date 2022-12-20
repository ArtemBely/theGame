this.onmessage = (event) => {
  if (event.data.type === 'tangents') {
    const geometry = event.data.object
    
    console.log(geometry)
  }
};

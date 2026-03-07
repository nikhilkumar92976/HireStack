const emailTemplate = ({ title, message, buttonText, buttonLink }) => {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>${title}</h2>
      <p>${message}</p>
      <a href="${buttonLink}"
         style="
           display: inline-block;
           padding: 10px 20px;
           background-color: #4CAF50;
           color: white;
           text-decoration: none;
           border-radius: 5px;
         ">
        ${buttonText}
      </a>
    </div>
  `;
};

module.exports = emailTemplate;
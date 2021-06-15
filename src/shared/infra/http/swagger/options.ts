const options = {
 // explorer: true,
 customCss: `
   .topbar-wrapper img[alt="Swagger UI"], .topbar-wrapper span {
       visibility: hidden;
   }
   .topbar-wrapper span:after {
       content: 'mylogo';
       color: #fff;
       visibility: visible;
       display: block;
       position: absolute;
       padding: 5px;
       top: 2px;
   }
   .swagger-ui table tbody tr td:first-of-type {
     padding: 27px 0;
   }
   .swagger-ui .parameter__name.required:after {
     top: -2px;
   }
   .swagger-ui .model .property {
     display:none;
   }
   .swagger-ui .scheme-container {
     margin: -80px 0 20px;
     padding: 5px 0;
 `,
};

export default options;

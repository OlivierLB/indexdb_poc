import axios from 'axios';

const config = (window).__cwfEnv || {
  apiApplication: process.env.REACT_APP_API_APPLICATION,
};

const application = axios.create({
  baseURL: config.apiApplication,
});

export {
  application, config,
}
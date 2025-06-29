# NASA Dashboard

A modern React application that provides access to NASA's Astronomy Picture of the Day (APOD) API with a beautiful, responsive interface.

![Nasa Banner](public/logo.svg)

## Features

- 🌌 **APOD Gallery**: Browse NASA's daily astronomy images and videos
- 📅 **Date Range Search**: View APODs from specific dates or date ranges
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- 🎨 **Modern UI**: Clean, dark theme
- 📄 **Pagination**: Efficient browsing of large date ranges
- 🔑 **API Key Management**: Easy setup with NASA API key

## Demo

![Demo Screenshot](public/screenshot.png)

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn]

### Installation

   ```bash
   # Clone the repository
   git clone https://github.com/adityabhatkar23/nasa.git
   cd nasa

   # Install dependencies
   npm install
   # or
   yarn install
   ```

### Running Locally

```bash
# Start the development server
$ npm run dev
# or
yarn dev
```

### Get a NASA API Key

- Visit [https://api.nasa.gov/](https://api.nasa.gov/)

- Sign up for a free API key

### Add your API key

- Enter your NASA API key in the app
- Start exploring APODs!

Open [http://localhost:5173](http://localhost:5173) in your browser to use NASA Dashboard.

## Usage

- **Today's APOD**: Automatically loads the latest astronomy picture
- **Specific Date**: Choose any date to view that day's APOD
- **Date Range**: Select start and end dates to browse multiple APODs
- **Pagination**: Navigate through large collections with ease

## Tech Stack

- **React 18** - UI framework
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **NASA APOD API** - Data source
- **Vite** - Build tool

## API Reference

This project uses NASA's [APOD API](https://api.nasa.gov/planetary/apod):

- **Endpoint**: `https://api.nasa.gov/planetary/apod`
- **Authentication**: API key required
- **Rate Limit**: 1000 requests per hour (free tier)

## License

MIT License - feel free to use this project for your own purposes.

---

Built with ❤️ by [Aditya](https://adityabhatkar23.github.io/portfolio/) using NASA's amazing API

import React, { useState, useRef, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import {
  FaBars,
  FaQrcode,
  FaDrumstickBite,
  FaFireAlt
} from 'react-icons/fa';
import { IoFastFoodOutline } from 'react-icons/io5';
import './Dashboard.css';
import {Link} from "react-router-dom";
import banner1 from '../images/banner1.jpg';
import banner2 from '../images/banner2.jpg';
import banner3 from '../images/banner3.jpg';
import logo from '../images/NutriverseLogo.png';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  // Sidebar toggle
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const hamburgerRef = useRef(null);

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Close sidebar on mobile if clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        isSidebarOpen &&
        window.innerWidth < 768 &&
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target) &&
        hamburgerRef.current &&
        !hamburgerRef.current.contains(e.target)
      ) {
        setIsSidebarOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSidebarOpen]);

  // Carousel
  const carouselImages = [banner1, banner2, banner3];
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prevSlide) =>
        prevSlide === carouselImages.length - 1 ? 0 : prevSlide + 1
      );
    }, 3000);
    return () => clearInterval(slideInterval);
  }, [carouselImages.length]);

  // Chart data
  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Carbs',
        data: [30, 45, 60, 40, 70, 50, 65],
        backgroundColor: '#20B2AA'
      },
      {
        label: 'Protein',
        data: [50, 60, 55, 70, 80, 60, 75],
        backgroundColor: '#FFB347'
      },
      {
        label: 'Fats',
        data: [40, 30, 50, 60, 40, 50, 45],
        backgroundColor: '#9370DB'
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' },
      title: { display: false }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100
      }
    }
  };

  // Some other popup states (if used)
  const [qrOpen, setQrOpen] = useState(true);

  // ===== SCANNER POPUP STATE =====
  const [scannerOpen, setScannerOpen] = useState(true);
  const [scanResult, setScanResult] = useState(null);
  const scannerVideoRef = useRef(null);
  const scannerCanvasRef = useRef(null);

  // Request camera on scanner open
  useEffect(() => {
    if (scannerOpen) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          if (scannerVideoRef.current) {
            scannerVideoRef.current.srcObject = stream;
          }
        })
        .catch(err => console.error('Error accessing camera:', err));
    }
  }, [scannerOpen]);

  // Capture image & call backend
  const captureAndScan = async () => {
    const canvas = scannerCanvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(scannerVideoRef.current, 0, 0, canvas.width, canvas.height);
    const base64Image = canvas.toDataURL('image/jpeg');

    try {
      const response = await fetch('http://localhost:3000/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64Image })
      });
      const data = await response.json();
      setScanResult(data);
      console.log('Full LogMeal response:', data);
    } catch (error) {
      console.error('Error scanning image:', error);
    }
  };

  // Close scanner popup
  const closeScanner = () => {
    setScannerOpen(false);
  };

  // ===== PARSE SHORT RESULT =====
  let topDish = 'Unknown Dish';
  let calories = 0;
  let carbs = 0;
  let protein = 0;
  let fat = 0;

  if (scanResult) {
    // Recognition: top recognized dish
    topDish =
      scanResult.recognition?.recognition_results?.[0]?.name || 'Unknown Dish';

    // Nutritional info
    calories = scanResult.nutrition?.nutritional_info?.calories || 0;
    carbs = scanResult.nutrition?.nutritional_info?.totalNutrients?.CHOCDF?.quantity || 0;
    protein = scanResult.nutrition?.nutritional_info?.totalNutrients?.PROCNT?.quantity || 0;
    fat = scanResult.nutrition?.nutritional_info?.totalNutrients?.FAT?.quantity || 0;
  }

  return (
    <div className="dashboard-container">
      {/* SCANNER MODAL */}
      {scannerOpen && (
        <div className="scanner-modal">
          <div className="scanner-content">
            <h2>Food Scanner</h2>
            <video
              ref={scannerVideoRef}
              width="320"
              height="240"
              autoPlay
              className="scanner-video"
            />
            <canvas
              ref={scannerCanvasRef}
              width="320"
              height="240"
              style={{ display: 'none' }}
            />
            <div className="scanner-buttons">
              <button onClick={captureAndScan}>Scan</button>
              <button onClick={closeScanner}>Close</button>
            </div>

            {/* Short Summary of the recognized dish & nutrition */}
            {scanResult && (
              <div className="scan-result">
                <h3>Best Guess: {topDish}</h3>
                <p>Calories: {calories}</p>
                <p>Carbs: {carbs} g</p>
                <p>Protein: {protein} g</p>
                <p>Fat: {fat} g</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===== LEFT SIDEBAR ===== */}
      <div ref={sidebarRef} className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <img src={logo} alt="Logo" className="logo" />
        </div>
        <ul className="sidebar-menu">
          <Link to="/community"><li>Community</li></Link>
          <li>Leaderboards</li>
          <li>AI</li>
          <li>Education</li>
          <li>Plans</li>
        </ul>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="main-content">
        <div className="top-navbar">
          <div className="left-section">
            <button
              ref={hamburgerRef}
              className="hamburger"
              onClick={handleToggleSidebar}
            >
              <FaBars />
            </button>
            <div className="greeting">
              <h4>Good Evening <span role="img" aria-label="party">🎉</span></h4>
              <h2>Welcome Back</h2>
            </div>
          </div>
          <button className="qr-button" onClick={() => setQrOpen(true)}>
            <FaQrcode />
          </button>
        </div>

        {/* Banner / Carousel */}
        <div className="banner">
          <div className="carousel">
            <img
              src={carouselImages[currentSlide]}
              alt={`Slide ${currentSlide + 1}`}
              className="banner-img"
            />
            <div className="carousel-dots">
              {carouselImages.map((_, idx) => (
                <span
                  key={idx}
                  className={`carousel-dot ${currentSlide === idx ? 'active' : ''}`}
                  onClick={() => setCurrentSlide(idx)}
                ></span>
              ))}
            </div>
          </div>
        </div>

        {/* Macro Cards */}
        <div className="macro-cards">
          <div className="macro-card carbs">
            <div className="card-details">
              <div className="card-text">
                <span className="card-label">Carbs</span>
                <p className="card-value">270g</p>
              </div>
              <div className="card-icon">
                <IoFastFoodOutline />
              </div>
            </div>
          </div>
          <div className="macro-card protein">
            <div className="card-details">
              <div className="card-text">
                <span className="card-label">Protein</span>
                <p className="card-value">97g</p>
              </div>
              <div className="card-icon">
                <FaDrumstickBite />
              </div>
            </div>
          </div>
          <div className="macro-card fats">
            <div className="card-details">
              <div className="card-text">
                <span className="card-label">Fats</span>
                <p className="card-value">150g</p>
              </div>
              <div className="card-icon">
                <FaFireAlt />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Chart & Monthly Progress */}
        <div className="bottom-section">
          <div className="nutrients-consumed">
            <h3>Nutrients Consumed</h3>
            <div className="chart-wrapper">
              <Bar data={chartData} options={chartOptions} />
            </div>
          </div>
          <div className="monthly-progress">
            <h3>Monthly Progress</h3>
            <div className="progress-circle">
              <span>80%</span>
            </div>
            <p>You have achieved <strong>80%</strong> of your daily nutrition goals</p>
          </div>
        </div>

        {/* Meals Consumed */}
        <div className="meals-consumed-container">
          <div className="meals-header">
            <h3>Meals Consumed</h3>
            <button className="add-meal-button">+ ADD</button>
          </div>
          <div className="meal-card">
            <div className="meal-info">
              <h4>Monday</h4>
              <p>Bread Jam</p>
              <span className="meal-quantity">6 Pieces</span>
            </div>
            <div className="meal-time">At 08:00am</div>
          </div>
          <div className="meal-card">
            <div className="meal-info">
              <h4>Sunday</h4>
              <p>Pizza</p>
              <span className="meal-quantity">Medium</span>
            </div>
            <div className="meal-time">At 09:00pm</div>
          </div>
          <div className="meal-card">
            <div className="meal-info">
              <h4>Sunday</h4>
              <p>Chips</p>
              <span className="meal-quantity">1 Packet</span>
            </div>
            <div className="meal-time">At 07:30pm</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

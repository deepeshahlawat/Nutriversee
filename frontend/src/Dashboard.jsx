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
  FaPlus,
  FaBars,
  FaQrcode,
  FaDrumstickBite,
  FaFireAlt
} from 'react-icons/fa';
import { IoFastFoodOutline } from "react-icons/io5";
import QRCodeScanner from './QRCodeScanner';
import './Dashboard.css';
import banner1 from "../images/banner1.jpg";
import banner2 from "../images/banner2.jpg";
import banner3 from "../images/banner3.jpg";
import logo from "../images/NutriverseLogo.png";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  // Sidebar toggle state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const hamburgerRef = useRef(null);

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Close sidebar on mobile when clicking outside
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

  // Carousel State
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

  // Chart Data
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
      legend: {
        position: 'bottom'
      },
      title: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100
      }
    }
  };

  // QR Code Popup State (initially open)
  const [qrOpen, setQrOpen] = useState(true);

  return (
    <div className="dashboard-container">
      {/* Left Sidebar */}
      <div ref={sidebarRef} className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <img
            src={logo}
            alt="Logo"
            className="logo"
          />
        </div>
        <ul className="sidebar-menu">
          <li className="active">Community</li>
          <li>Leaderboards</li>
          <li>AI</li>
          <li>Education</li>
          <li>Plans</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="top-navbar">
          <div className="left-section">
            <button ref={hamburgerRef} className="hamburger" onClick={handleToggleSidebar}>
              <FaBars />
            </button>
            <div className="greeting">
              <h4>
                Good Evening <span role="img" aria-label="party">🎉</span>
              </h4>
              <h2>Welcome Back</h2>
            </div>
          </div>

          <button className="qr-button" onClick={() => setQrOpen(true)}>
            <FaQrcode />
          </button>
        </div>

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

        {/* Macro Cards with Icons Aligned to the Right */}
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
            <p>
              You have achieved <strong>80%</strong> of your daily nutrition goals
            </p>
          </div>
        </div>

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

      {/* QR Code Scanner Popup */}
      <QRCodeScanner isOpen={qrOpen} onClose={() => setQrOpen(false)} />
    </div>
  );
};

export default Dashboard;

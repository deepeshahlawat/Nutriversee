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
// Icons for the macro cards (you can pick others if you prefer)
import { FaTint, FaDrumstickBite, FaFireAlt } from 'react-icons/fa';
import { FaPlus, FaBars } from 'react-icons/fa';
import './Dashboard.css';

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
  // ======= SIDEBAR TOGGLE FOR MOBILE =======
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const hamburgerRef = useRef(null);

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Close sidebar when clicking outside on mobile
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

  // ======= CAROUSEL STATE =======
  const carouselImages = [
    'https://via.placeholder.com/600x200?text=Slide+1',
    'https://via.placeholder.com/600x200?text=Slide+2',
    'https://via.placeholder.com/600x200?text=Slide+3'
  ];
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto change slide every 3 seconds
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prevSlide) =>
        prevSlide === carouselImages.length - 1 ? 0 : prevSlide + 1
      );
    }, 3000);
    return () => clearInterval(slideInterval);
  }, [carouselImages.length]);

  // ======= CHART DATA =======
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

  return (
    <div className="dashboard-container">
      {/* ===== Left Sidebar ===== */}
      <div ref={sidebarRef} className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          {/* Replace with your actual logo image */}
          <img
            src="https://via.placeholder.com/120x40?text=LOGO"
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

      {/* ===== Main Content ===== */}
      <div className="main-content">
        {/* Top Navbar */}
        <div className="top-navbar">
          <div className="left-section">
            {/* Hamburger for mobile */}
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
          <div className="user-profile">
            {/* User avatar placeholder */}
            <img src="https://via.placeholder.com/40" alt="User" />
          </div>
        </div>

        {/* Banner Carousel */}
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

        {/* Macro Cards (Styled to match your snippet) */}
        <div className="macro-cards">
          <div className="macro-card carbs">
            <div className="card-content">
              <FaTint className="macro-icon" />
              <span>Carbs</span>
            </div>
            <p>270g</p>
          </div>
          <div className="macro-card protein">
            <div className="card-content">
              <FaDrumstickBite className="macro-icon" />
              <span>Protein</span>
            </div>
            <p>97g</p>
          </div>
          <div className="macro-card fats">
            <div className="card-content">
              <FaFireAlt className="macro-icon" />
              <span>Fats</span>
            </div>
            <p>150g</p>
          </div>
        </div>

        {/* Bottom Section: Nutrients + Monthly Progress */}
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
      </div>

      {/* ===== Right Sidebar ===== */}
      <div className="right-sidebar">
        <div className="meals-consumed">
          <h3>Meals Consumed</h3>
          {/* "ADD" button */}
          <button className="add-button">
            <FaPlus /> ADD
          </button>
          <ul>
            <li>
              <span className="meal-day">Monday</span>
              <span className="meal-detail">8 Pieces</span>
              <span className="meal-time">At 08:00pm</span>
            </li>
            <li>
              <span className="meal-day">Sunday</span>
              <span className="meal-detail">Medium</span>
              <span className="meal-time">At 07:00pm</span>
            </li>
            <li>
              <span className="meal-day">Sunday</span>
              <span className="meal-detail">Chips</span>
              <span className="meal-time">At 05:00pm</span>
            </li>
          </ul>
        </div>

        <div className="explore-communities">
          <button className="explore-button">
            Explore Communities &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

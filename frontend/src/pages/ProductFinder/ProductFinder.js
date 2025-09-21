import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import Product from "../../components/home/Products/Product";

const ProductFinder = () => {
  const [products, setProducts] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [preferences, setPreferences] = useState({
    budget: '',
    priority: '',
    screenSize: '',
    storage: '',
    brand: ''
  });
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  const imagePath = "http://localhost/api/products/";

  // Questions configuration
  const questions = [
    {
      id: 'budget',
      question: 'What is your budget range?',
      type: 'select',
      options: [
        { value: '0-25000', label: 'Under Rs. 25,000' },
        { value: '25000-50000', label: 'Rs. 25,000 - Rs. 50,000' },
        { value: '50000-100000', label: 'Rs. 50,000 - Rs. 100,000' },
        { value: '100000-200000', label: 'Rs. 100,000 - Rs. 200,000' },
        { value: '200000+', label: 'Above Rs. 200,000' }
      ]
    },
    {
      id: 'priority',
      question: 'What is most important to you?',
      type: 'select',
      options: [
        { value: 'performance', label: 'Performance & Speed' },
        { value: 'camera', label: 'Camera Quality' },
        { value: 'battery', label: 'Battery Life' },
        { value: 'display', label: 'Display Quality' },
        { value: 'price', label: 'Best Value for Money' }
      ]
    },
    {
      id: 'screenSize',
      question: 'Preferred screen size?',
      type: 'select',
      options: [
        { value: 'small', label: 'Compact (Under 6")' },
        { value: 'medium', label: 'Standard (6" - 6.5")' },
        { value: 'large', label: 'Large (6.5" - 7")' },
        { value: 'any', label: 'No preference' }
      ]
    },
    {
      id: 'storage',
      question: 'Minimum internal storage?',
      type: 'select',
      options: [
        { value: '32', label: '32GB' },
        { value: '64', label: '64GB' },
        { value: '128', label: '128GB' },
        { value: '256', label: '256GB' },
        { value: '512', label: '512GB or more' }
      ]
    },
    {
      id: 'brand',
      question: 'Do you prefer a specific brand?',
      type: 'select',
      options: [
        { value: 'apple', label: 'Apple' },
        { value: 'samsung', label: 'Samsung' },
        { value: 'xiaomi', label: 'Xiaomi' },
        { value: 'oneplus', label: 'OnePlus' },
        { value: 'huawei', label: 'Huawei' },
        { value: 'any', label: 'No preference' }
      ]
    }
  ];

  // Load all products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost/api/get_product.php");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  // Handle answer selection
  const handleAnswer = (questionId, value) => {
    setPreferences(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  // Navigate to next question
  const nextQuestion = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      findRecommendations();
    }
  };

  // Navigate to previous question
  const prevQuestion = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Find product recommendations based on preferences
  const findRecommendations = () => {
    setLoading(true);
    
    let filteredProducts = [...products];
    let scoredProducts = [];

    // Filter by budget
    if (preferences.budget) {
      filteredProducts = filteredProducts.filter(product => {
        const price = parseInt(product.price);
        const [min, max] = preferences.budget.split('-').map(p => p.replace('+', ''));
        
        if (preferences.budget === '200000+') {
          return price >= 200000;
        } else {
          return price >= parseInt(min) && price <= parseInt(max);
        }
      });
    }

    // Score products based on preferences
    filteredProducts.forEach(product => {
      let score = 0;
      
      // Base score for available products
      if (product.availability === 'yes' && parseInt(product.qty) > 0) {
        score += 10;
      }

      // Priority scoring (this would be enhanced with actual product specs)
      if (preferences.priority) {
        // You can enhance this with actual product specifications
        score += 5; // Base priority score
      }

      // Brand preference
      if (preferences.brand && preferences.brand !== 'any') {
        const productName = product.productName.toLowerCase();
        if (productName.includes(preferences.brand.toLowerCase())) {
          score += 15;
        }
      }

      // Storage preference (would need storage field in database)
      if (preferences.storage) {
        // This would be enhanced with actual storage data
        score += 3;
      }

      scoredProducts.push({
        ...product,
        score: score
      });
    });

    // Sort by score and get top 6 recommendations
    const topRecommendations = scoredProducts
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);

    // If no good matches found (all products have low scores), show all available products
    if (topRecommendations.length === 0 || topRecommendations[0].score <= 15) {
      // Show all available products as fallback
      const allAvailableProducts = products
        .filter(product => product.availability === 'yes' && parseInt(product.qty) > 0)
        .slice(0, 12); // Show up to 12 products
      
      setRecommendations(allAvailableProducts.map(product => ({
        ...product,
        score: 0,
        showAllProducts: true // Flag to indicate this is showing all products
      })));
    } else {
      setRecommendations(topRecommendations);
    }
    
    setLoading(false);
  };

  // Reset finder
  const resetFinder = () => {
    setCurrentStep(0);
    setPreferences({
      budget: '',
      priority: '',
      screenSize: '',
      storage: '',
      brand: ''
    });
    setRecommendations([]);
  };

  const currentQuestion = questions[currentStep];
  const isLastQuestion = currentStep === questions.length - 1;
  const currentAnswer = preferences[currentQuestion?.id];

  if (recommendations.length > 0) {
    const showingAllProducts = recommendations[0]?.showAllProducts;
    
    return (
      <div className="max-w-container mx-auto px-4">
        <Breadcrumbs title="Product Finder" />
        <div className="pb-20">
          <div className="text-center mb-8">
            {showingAllProducts ? (
              <>
                <h1 className="text-3xl font-bold text-gray-800 mb-4">No Perfect Matches Found</h1>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 inline-block">
                  <p className="text-yellow-800 font-medium">😔 We couldn't find products that exactly match your preferences.</p>
                  <p className="text-yellow-700 text-sm mt-1">Here are all our available products for you to explore:</p>
                </div>
              </>
            ) : (
              <>
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Your Perfect Matches!</h1>
                <p className="text-gray-600 mb-6">Based on your preferences, here are our top recommendations:</p>
              </>
            )}
            <button
              onClick={resetFinder}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Find Again
            </button>
          </div>

          {/* Additional message for showing all products */}
          {showingAllProducts && (
            <div className="text-center mb-6">
              <p className="text-gray-600 text-sm">
                💡 Try adjusting your preferences or browse all our products below. 
                You can also contact our support team for personalized recommendations!
              </p>
            </div>
          )}

          {/* Recommendations Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recommendations.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {!showingAllProducts && index === 0 && (
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold z-10">
                    Best Match
                  </div>
                )}
                <Product
                  id={product.id}
                  img={product.imageName}
                  productName={product.productName}
                  price={product.price}
                  color={product.color}
                  badge={product.condition}
                  des={product.description}
                  availability={product.availability}
                  qty={product.qty}
                  type={product.type}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-container mx-auto px-4">
      <Breadcrumbs title="Product Finder" />
      <div className="pb-20">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Find Your Perfect Product</h1>
            <p className="text-gray-600">Answer a few questions to get personalized recommendations</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Progress</span>
              <span className="text-sm text-gray-600">{currentStep + 1} of {questions.length}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Question Card */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-lg shadow-lg p-8 mb-8"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              {currentQuestion.question}
            </h2>

            <div className="space-y-3">
              {currentQuestion.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(currentQuestion.id, option.value)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    currentAnswer === option.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                      currentAnswer === option.value
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {currentAnswer === option.value && (
                        <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                      )}
                    </div>
                    {option.label}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <button
              onClick={prevQuestion}
              disabled={currentStep === 0}
              className={`px-6 py-2 rounded-lg transition-colors ${
                currentStep === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-600 text-white hover:bg-gray-700'
              }`}
            >
              Previous
            </button>

            <button
              onClick={nextQuestion}
              disabled={!currentAnswer}
              className={`px-6 py-2 rounded-lg transition-colors ${
                !currentAnswer
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isLastQuestion ? 'Find Products' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductFinder;
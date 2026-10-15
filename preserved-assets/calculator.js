document.addEventListener("DOMContentLoaded", function () {
  // Elements
  const principalInput = document.getElementById("principalInput");
  const amountInWords = document.getElementById("amountInWords");
  const typeRupeeBtn = document.getElementById("typeRupeeBtn");
  const typePercentBtn = document.getElementById("typePercentBtn");
  const rateInput = document.getElementById("rateInput");
  const rateInputLabel = document.getElementById("rateInputLabel");
  const showEquivalentToggle = document.getElementById("showEquivalentToggle");
  const equivalentText = document.getElementById("equivalentText");
  const fromDateInput = document.getElementById("fromDateInput");
  const toDateInput = document.getElementById("toDateInput");
  const siForm = document.getElementById("siForm");
  const clearFieldsBtn = document.getElementById("clearFieldsBtn");

  // Result Elements
  const resDuration = document.getElementById("resDuration");
  const resRate = document.getElementById("resRate");
  const resPrincipal = document.getElementById("resPrincipal");
  const resMonthlyInterest = document.getElementById("resMonthlyInterest");
  const resInterestAmount = document.getElementById("resInterestAmount");
  const resDailyInterest = document.getElementById("resDailyInterest");
  const resYearlyInterest = document.getElementById("resYearlyInterest");
  const resTotalAmount = document.getElementById("resTotalAmount");

  // State Variables
  let interestType = "rupee"; // "rupee" or "percent"

  // Set default dates
  const today = new Date();
  const nextMonth = new Date();
  nextMonth.setMonth(today.getMonth() + 1);

  fromDateInput.value = formatDateToISO(today);
  toDateInput.value = formatDateToISO(nextMonth);

  // Initial calculations
  updateAmountInWords();
  updateEquivalentText();
  calculateAll();

  // Event Listeners
  principalInput.addEventListener("input", function () {
    updateAmountInWords();
    calculateAll();
  });

  typeRupeeBtn.addEventListener("click", function () {
    interestType = "rupee";
    typeRupeeBtn.classList.add("active");
    typePercentBtn.classList.remove("active");
    rateInputLabel.innerText = "Interest Rate (₹ per ₹100 / month)";
    updateEquivalentText();
    calculateAll();
  });

  typePercentBtn.addEventListener("click", function () {
    interestType = "percent";
    typePercentBtn.classList.add("active");
    typeRupeeBtn.classList.remove("active");
    rateInputLabel.innerText = "Interest Rate (% per annum)";
    updateEquivalentText();
    calculateAll();
  });

  rateInput.addEventListener("input", function () {
    updateEquivalentText();
    calculateAll();
  });

  showEquivalentToggle.addEventListener("change", function () {
    if (showEquivalentToggle.checked) {
      equivalentText.style.display = "block";
    } else {
      equivalentText.style.display = "none";
    }
  });

  fromDateInput.addEventListener("change", calculateAll);
  toDateInput.addEventListener("change", calculateAll);

  siForm.addEventListener("submit", function (e) {
    e.preventDefault();
    calculateAll();
  });

  clearFieldsBtn.addEventListener("click", function (e) {
    e.preventDefault();
    principalInput.value = "";
    rateInput.value = "";
    amountInWords.innerText = "";
    fromDateInput.value = formatDateToISO(today);
    toDateInput.value = formatDateToISO(nextMonth);
    
    // Clear results
    resDuration.innerText = "-";
    resRate.innerText = "-";
    resPrincipal.innerText = "-";
    resMonthlyInterest.innerText = "-";
    resInterestAmount.innerText = "-";
    resDailyInterest.innerText = "-";
    resYearlyInterest.innerText = "-";
    resTotalAmount.innerText = "-";
  });

  // Helper: Format Date to YYYY-MM-DD
  function formatDateToISO(date) {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  // Number to Indian Rupees in Words
  function updateAmountInWords() {
    const val = parseFloat(principalInput.value);
    if (isNaN(val) || val <= 0) {
      amountInWords.innerText = "";
      return;
    }
    amountInWords.innerText = numberToIndianWords(Math.round(val)) + " Rupees";
  }

  function numberToIndianWords(num) {
    const a = [
      '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
      'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
    ];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    if (num === 0) return 'Zero';

    function helper(n) {
      let str = "";
      if (n > 99) {
        str += a[Math.floor(n / 100)] + " Hundred ";
        n %= 100;
      }
      if (n > 19) {
        str += b[Math.floor(n / 10)] + " " + a[n % 10];
      } else if (n > 0) {
        str += a[n];
      }
      return str.trim();
    }

    let result = "";
    
    // Crores (1,00,00,000)
    if (num >= 10000000) {
      result += helper(Math.floor(num / 10000000)) + " Crore ";
      num %= 10000000;
    }
    // Lakhs (1,00,000)
    if (num >= 100000) {
      result += helper(Math.floor(num / 100000)) + " Lakh ";
      num %= 100000;
    }
    // Thousands (1,000)
    if (num >= 1000) {
      result += helper(Math.floor(num / 1000)) + " Thousand ";
      num %= 1000;
    }
    // Remainder
    result += helper(num);

    return result.trim().replace(/\s+/g, ' ');
  }

  // Update equivalent interest rate display
  function updateEquivalentText() {
    const rate = parseFloat(rateInput.value);
    if (isNaN(rate) || rate <= 0) {
      equivalentText.innerText = "Equivalent: -";
      return;
    }

    if (interestType === "rupee") {
      // rate is ₹ per ₹100 / month = rate % per month.
      // Equivalent per annum = rate * 12 %
      const pa = rate * 12;
      equivalentText.innerText = `Equivalent: ${pa.toFixed(2)}% per annum`;
    } else {
      // rate is % per annum.
      // Equivalent rupees per ₹100 per month = rate / 12
      const pm = rate / 12;
      equivalentText.innerText = `Equivalent: ₹${pm.toFixed(2)} /100/month`;
    }
  }

  // Main Calculation Logic
  function calculateAll() {
    const P = parseFloat(principalInput.value);
    const rateVal = parseFloat(rateInput.value);
    const fromDateStr = fromDateInput.value;
    const toDateStr = toDateInput.value;

    if (isNaN(P) || isNaN(rateVal) || !fromDateStr || !toDateStr) {
      return;
    }

    const fromDate = new Date(fromDateStr);
    const toDate = new Date(toDateStr);

    if (toDate < fromDate) {
      resDuration.innerText = "Invalid date range";
      return;
    }

    // 1. Duration calculation
    const duration = calculateDuration(fromDate, toDate);
    const totalDays = duration.totalDays;

    if (totalDays === 0) {
      resDuration.innerText = "0y 0m 0d";
      resInterestAmount.innerText = "₹0";
      resDailyInterest.innerText = "₹0.00";
      resYearlyInterest.innerText = "₹0.00";
      resTotalAmount.innerText = `₹${P.toLocaleString("en-IN")}`;
      return;
    }

    resDuration.innerText = `${duration.years}y ${duration.months}m ${duration.days}d`;

    // 2. Interest Rate Translation
    let monthlyRate = 0;
    let rateDisplayStr = "";
    if (interestType === "rupee") {
      monthlyRate = rateVal; // 16% per month
      rateDisplayStr = `₹${rateVal} /100/mo`;
    } else {
      monthlyRate = rateVal / 12; // rateVal% per annum / 12
      rateDisplayStr = `${rateVal}% p.a.`;
    }

    resRate.innerText = rateDisplayStr;
    resPrincipal.innerText = `₹${P.toLocaleString("en-IN")}`;

    // 3. Monthly Interest
    const monthlyInterest = P * (monthlyRate / 100);
    resMonthlyInterest.innerText = `₹${Math.round(monthlyInterest).toLocaleString("en-IN")}`;

    // 4. Total Interest calculation
    // Standard compound/simple logic based on year, month, day fractions:
    // MonthsFraction = Years * 12 + Months + Days / 30
    const totalMonthsFraction = duration.years * 12 + duration.months + duration.days / 30;
    const interestAmount = monthlyInterest * totalMonthsFraction;

    resInterestAmount.innerText = `₹${Math.round(interestAmount).toLocaleString("en-IN")}`;

    // 5. Daily & Yearly Interest
    // Daily Interest = Total Interest / Total Days
    const dailyInterest = interestAmount / totalDays;
    resDailyInterest.innerText = `₹${dailyInterest.toFixed(2)}`;

    // Yearly Interest = Monthly Interest * 12
    const yearlyInterest = monthlyInterest * 12;
    resYearlyInterest.innerText = `₹${Math.round(yearlyInterest).toLocaleString("en-IN")}`;

    // 6. Total Amount
    const totalAmount = P + interestAmount;
    resTotalAmount.innerText = `₹${Math.round(totalAmount).toLocaleString("en-IN")}`;
  }

  // Calculate detailed duration between two dates
  function calculateDuration(d1, d2) {
    const totalMs = d2 - d1;
    const totalDays = Math.round(totalMs / (1000 * 60 * 60 * 24));

    let years = d2.getFullYear() - d1.getFullYear();
    let months = d2.getMonth() - d1.getMonth();
    let days = d2.getDate() - d1.getDate();

    if (days < 0) {
      months--;
      // Find days in previous month
      const prevMonth = new Date(d2.getFullYear(), d2.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    return {
      years: years,
      months: months,
      days: days,
      totalDays: totalDays
    };
  }
});

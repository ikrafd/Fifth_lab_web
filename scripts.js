function changeContent() {
  
  var inRightContent = document.getElementsByClassName("inRight")[0].cloneNode(true);
  var topContent = document.getElementsByClassName("content")[0].cloneNode(true);
  var images = inRightContent.getElementsByTagName('img');

  if (images.length > 0) {
    images[0].parentNode.removeChild(images[0]);
  }

  document.getElementsByClassName("content")[0].innerHTML = inRightContent.innerHTML;
  document.getElementsByClassName("inRight")[0].innerHTML = topContent.innerHTML;
}

function calculateCircle() {
  var radius = 5;
  let square = radius**2 * Math.PI;
  document.getElementsByClassName("inLeft")[0].innerHTML += square;
}

document.addEventListener('DOMContentLoaded', () => {
  if (getCookie("minDigit")) {
    let minDigit = getCookie("minDigit");
    let keepData = confirm(`Збережене значення: ${minDigit}. Чи бажаєте ви зберегти ці дані?`);
    if (keepData) {
      alert("Дані збережені у cookies. Оновіть сторінку.");
    } else {
      document.cookie = "minDigit=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      location.reload();
    }

    document.getElementById("numberForm").style.display = 'none';
  } else {
    document.getElementById("numberForm").style.display = 'block';

    document.getElementById("numberForm").addEventListener('submit', function(event) {
      event.preventDefault();
      let number = document.getElementById("numberInput").value;
      let minDigit = findMinDigit(number);
      alert(`Мінімальна цифра: ${minDigit}`);
      document.cookie = "minDigit=" + minDigit + "; path=/;";
    });
  }

  const savedColor = localStorage.getItem('selectedColor');
    if (savedColor) {
        document.querySelector('.inRight').style.color = savedColor;
        document.getElementById('colorSelect').value = savedColor;
    }

    document.getElementById('colorSelect').addEventListener('change', function() {
        const selectedColor = this.value;
        document.querySelector('.inRight').style.color = selectedColor;
        localStorage.setItem('selectedColor', selectedColor);
    });
});

function findMinDigit(number) {
  return Math.min(...number.split('').filter(char => !isNaN(char) && char !== ' '));
}

function getCookie(name) {
  let cookieArr = document.cookie.split(';');
  for (let i = 0; i < cookieArr.length; i++) {
    let cookiePair = cookieArr[i].split('=');
    if (name === cookiePair[0].trim()) {
      return decodeURIComponent(cookiePair[1]);
    }
  }
  return null;
}


function createTable(blockNumber, data) {
  const table = document.createElement('table');
  const rowData = data.split(',');
  const numRows = rowData.length % 2 === 0 ? 2 : 1;
  const block = document.getElementsByClassName(`block-${blockNumber}`)[0];

  for (let i = 0; i < numRows; i++) {
    const row = document.createElement('tr');
    for (let j = i; j < rowData.length; j += numRows) {
      const cell = document.createElement('td');
      cell.textContent = rowData[j];
      row.appendChild(cell);
    }
    table.appendChild(row);
  }

  
  block.appendChild(table);
}

function handleMouseOut(event, blockNumber) {
  const block = document.getElementsByClassName(`block-${blockNumber}`)[0];

  let allowMultipleForms = blockNumber === '5' && block.querySelectorAll('form').length < 2;

  const existingForm = block.querySelector('form');
  if (!existingForm || allowMultipleForms) {
    const form = document.createElement('form');
    form.innerHTML = '<input type="text" placeholder="Enter comma-separated values" />' +
                     '<button type="submit">Create Table</button>';

    form.onsubmit = function(e) {
      e.preventDefault();
      const data = form.querySelector('input').value;
      createTable(blockNumber, data);
    };

    event.target.parentNode.insertBefore(form, event.target.nextSibling);
  }
}

function saveData() {
  const tables = document.getElementsByTagName('table');
  const dataToSave = Array.from(tables).map(table => table.innerText).join(';');
  localStorage.setItem('savedTables', dataToSave);
}

document.querySelectorAll('img').forEach(img => {
  img.addEventListener('mouseout', function(event) {
    const parentBlock = event.target.closest('[class^="block-"]');
    if (parentBlock) {
      const match = parentBlock.className.match(/block-(\d+)/);
      if (match) {
        const blockNumber = match[1];
        handleMouseOut(event, blockNumber);
      }
    }
  });
});


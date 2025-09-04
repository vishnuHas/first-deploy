from flask import Flask,render_template,redirect,url_for,request
from flask_cors import cross_origin
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains
from selenium.common.exceptions import TimeoutException, NoSuchElementException
import numpy as np
import keyboard
import webbrowser

application=Flask(__name__)

@application.route('/')
@cross_origin()
def home():
    return render_template('index.html')

@application.route('/predict',methods=['GET','POST'])
@cross_origin()
def predict():
    if request.method == 'POST':
        try:
            def solve_sudoku(grid):
                """
                Improved Sudoku solver using constraint satisfaction and backtracking
                """
                def is_valid(grid, row, col, num):
                    # Check row
                    for x in range(9):
                        if grid[row][x] == num:
                            return False
                    
                    # Check column
                    for x in range(9):
                        if grid[x][col] == num:
                            return False
                    
                    # Check 3x3 box
                    start_row, start_col = 3 * (row // 3), 3 * (col // 3)
                    for i in range(3):
                        for j in range(3):
                            if grid[i + start_row][j + start_col] == num:
                                return False
                    
                    return True

                def find_empty(grid):
                    for i in range(9):
                        for j in range(9):
                            if grid[i][j] == 0:
                                return (i, j)
                    return None

                def solve(grid):
                    empty = find_empty(grid)
                    if not empty:
                        return True
                    
                    row, col = empty
                    
                    for num in range(1, 10):
                        if is_valid(grid, row, col, num):
                            grid[row][col] = num
                            
                            if solve(grid):
                                return True
                            
                            grid[row][col] = 0
                    
                    return False

                # Make a copy to avoid modifying original
                grid_copy = [row[:] for row in grid]
                
                if solve(grid_copy):
                    return grid_copy
                else:
                    return None

            # Start Selenium automation
            options = webdriver.ChromeOptions()
            options.add_experimental_option("detach", True)
            options.add_argument("--no-sandbox")
            options.add_argument("--disable-dev-shm-usage")
            options.add_argument("--disable-blink-features=AutomationControlled")
            options.add_experimental_option("excludeSwitches", ["enable-automation"])
            options.add_experimental_option('useAutomationExtension', False)
            
            driver = webdriver.Chrome(options=options)
            driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
            
            page = "https://sudoku.puzzlebaron.com/init.php"
            driver.get(page)
            
            # Wait for page to load
            time.sleep(2)
            
            # Click start button
            try:
                start_button = WebDriverWait(driver, 10).until(
                    EC.element_to_be_clickable((By.CLASS_NAME, "button_orange"))
                )
                start_button.click()
                time.sleep(2)
            except TimeoutException:
                print("Start button not found")
                driver.quit()
                return render_template('index.html', error="Could not find start button")
            
            while True:
                try:
                    # Wait for Sudoku table to be present
                    sudoku_table = WebDriverWait(driver, 10).until(
                        EC.presence_of_element_located((By.ID, "sudoku"))
                    )
                    
                    # Extract the puzzle
                    numbers = []
                    rows = sudoku_table.find_elements(By.CSS_SELECTOR, "tr")
                    
                    for r in range(len(rows)):
                        if r % 4 == 0:  # Skip border rows
                            continue
                        row = rows[r]
                        elements = row.find_elements(By.TAG_NAME, "td")
                        
                        for c in range(len(elements)):
                            if c % 4 == 0:  # Skip border columns
                                continue
                            cell = elements[c]
                            cell_text = cell.text.strip()
                            num = 0 if cell_text == '' else int(cell_text)
                            numbers.append(num)
                    
                    # Reshape to 9x9 grid
                    if len(numbers) != 81:
                        print(f"Expected 81 numbers, got {len(numbers)}")
                        break
                    
                    # Convert to numpy array for reshaping
                    numbers_array = np.array(numbers).reshape(9, 9)
                    numbers = numbers_array.tolist()  # Convert back to list for solver
                    
                    # Solve the puzzle
                    solved_grid = solve_sudoku(numbers)
                    
                    if solved_grid is None:
                        print("No solution found")
                        break
                    
                    # Convert solved grid to numpy array for flattening
                    solved_array = np.array(solved_grid)
                    solved_numbers = solved_array.flatten().tolist()
                    
                    # Fill in the solution
                    cur_idx = 0
                    
                    for r in range(len(rows)):
                        if r % 4 == 0:
                            continue
                        row = rows[r]
                        elements = row.find_elements(By.TAG_NAME, "td")
                        
                        for c in range(len(elements)):
                            if c % 4 == 0:
                                continue
                            
                            # Check if this cell was originally empty
                            original_row = cur_idx // 9
                            original_col = cur_idx % 9
                            if numbers_array[original_row][original_col] == 0:
                                cell = elements[c]
                                
                                # Clear the cell first
                                cell.click()
                                time.sleep(0.1)
                                
                                # Type the solution
                                solution_num = solved_numbers[cur_idx]
                                keyboard.write(str(solution_num))
                                time.sleep(0.1)
                            
                            cur_idx += 1
                    
                    # Submit the solution
                    try:
                        submit_button = WebDriverWait(driver, 10).until(
                            EC.element_to_be_clickable((By.CLASS_NAME, "button_green.sidebutton"))
                        )
                        submit_button.click()
                        time.sleep(2)
                        
                        # Check for success or error
                        try:
                            alert = driver.switch_to.alert
                            alert_text = alert.text
                            alert.accept()
                            
                            if "correct" in alert_text.lower():
                                print("Solution submitted successfully!")
                            else:
                                print(f"Error: {alert_text}")
                                break
                                
                        except:
                            # No alert, might be successful
                            print("Solution submitted (no alert)")
                            
                    except TimeoutException:
                        print("Submit button not found")
                        break
                        
                except Exception as e:
                    print(f"Error in solving: {e}")
                    break
                    
        except Exception as e:
            print(f"Error: {e}")
            return render_template('index.html', error="An error occurred while solving the Sudoku.")
    
    return render_template('index.html')

if __name__ == "__main__":
    application.run(debug=True, host='127.0.0.1', port=5000)
from flask import Flask,render_template,redirect,url_for,request
from flask_cors import cross_origin
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
import numpy as np
import keyboard
app=Flask(__name__)
@app.route('/')
@cross_origin()
def home():
    return render_template('index.html')
@app.route('/predict',methods=['GET','POST'])
@cross_origin()
def predict():
    if request.method == 'POST':
            def solve_sudoku(grid):
                row = [[True] * 9 for i in range(9)]
                col = [[True] * 9 for i in range(9)]
                regions = [[True] * 9 for i in range(9)]
                to_add = []
                for i in range(9):
                    for j in range(9):
                        if grid[i][j] != 0:
                            d = grid[i][j] - 1
                            row[i][d] = col[j][d] = regions[i // 3 * 3 + j // 3][d] = False
                        else:
                            to_add.append((i, j))
                    
                def backtrack():
                    if not to_add:
                        return True
                    i, j = to_add.pop()
                    for d in range(9):
                        if row[i][d] and col[j][d] and regions[i // 3 * 3 + j // 3][d]:
                            grid[i][j] = d + 1
                            row[i][d] = col[j][d] = regions[i // 3 * 3 + j // 3][d] = False
                            if backtrack():
                                return True
                            grid[i][j] = 0
                            row[i][d] = col[j][d] = regions[i // 3 * 3 + j // 3][d] = True
                    to_add.append((i, j))
                    return False
                backtrack()
    options=webdriver.ChromeOptions()
    options.add_experimental_option("detach",True)
    driver = webdriver.Chrome(options=options)
    page="https://sudoku.puzzlebaron.com/init.php"
    driver.maximize_window()
    driver.get(page)
    start_button=driver.find_element(By.CLASS_NAME,"button_orange")     
    start_button.click()      
    while True:
        sudoku_table=driver.find_element(By.ID,"sudoku")
        numbers=[]
        rows=sudoku_table.find_elements(By.CSS_SELECTOR,"tr")
        for r in range(len(rows)):
                if r % 4 == 0: continue
                row = rows[r]
                elements = row.find_elements(By.TAG_NAME,"td") 
                for c in range(len(elements)):
                    if c % 4 == 0: continue
                    cell = elements[c]
                    num = 0 if cell.text == '' else int(cell.text)
                    numbers.append(num)
        unknown = [num == 0 for num in numbers]
        numbers = np.reshape(numbers,(9,9))
        solve_sudoku(numbers)
        numbers = numbers.flatten()
        cur_idx = 0
        for r in range(len(rows)):
            if r % 4 == 0: continue
            row = rows[r]
            elements = row.find_elements(By.TAG_NAME,"td")
            for c in range(len(elements)):
                if c % 4 == 0: continue
                if not unknown[cur_idx]:
                    cur_idx += 1
                    continue
                cell = elements[c]
                cell.click()
                keyboard.write(str(numbers[cur_idx]))
                cur_idx += 1
        submit_button = driver.find_element(By.CLASS_NAME,"button_green.sidebutton")
        submit_button.click()
    


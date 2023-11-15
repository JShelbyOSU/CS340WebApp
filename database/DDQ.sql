SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;

-- Habitats Table Creation
CREATE OR REPLACE TABLE Habitats (
    habitatID INT AUTO_INCREMENT PRIMARY KEY,
    capacity INT,
    environmentDescription VARCHAR(80)
);

-- Employees Table Creation
CREATE OR REPLACE TABLE Employees (
    employeeID INT AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(20),
    lastName VARCHAR(20),
    position VARCHAR(25),
    hireDate DATE,
    salary DECIMAL,
    habitatID INT,
    FOREIGN KEY (habitatID) REFERENCES Habitats(habitatID)
    ON DELETE SET NULL
);

-- Shows Table Creation
CREATE OR REPLACE TABLE Shows (
    showID INT AUTO_INCREMENT PRIMARY KEY,
    showName VARCHAR(45),
    date DATE,
    startTime TIME,
    endTime TIME,
    ticketPrice DECIMAL,
    habitatID INT,
    FOREIGN KEY (habitatID) REFERENCES Habitats(habitatID)
    ON DELETE SET NULL
);

-- Penguins Table Creation
CREATE OR REPLACE TABLE Penguins (
    penguinID INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(20),
    dateOfBirth DATE,
    sex TINYINT(1),
    species VARCHAR(25),
    habitatID INT,
    FOREIGN KEY (habitatID) REFERENCES Habitats(habitatID)
    ON DELETE SET NULL
);

-- Employees_Shows Intersection Table Creation
CREATE OR REPLACE TABLE Employees_Shows (
    employeeID INT,
    showID INT,
    PRIMARY KEY (employeeID, showID),
    FOREIGN KEY (employeeID) REFERENCES Employees(employeeID),
    FOREIGN KEY (showID) REFERENCES Shows(showID)
);

-- Penguins_Shows Intersection Table Creation
CREATE OR REPLACE TABLE Penguins_Shows (
    penguinID INT,
    showID INT,
    PRIMARY KEY (penguinID, showID),
    FOREIGN KEY (penguinID) REFERENCES Penguins(penguinID),
    FOREIGN KEY (showID) REFERENCES Shows(showID)
);

-- Sample Data Insertion for Habitats Table
INSERT INTO Habitats (capacity, environmentDescription) VALUES
(8, 'Tropical environment with natural plants.'),
(12, 'Icy environment mimicking the Antarctic.'),
(12, 'Moderate temperature with a mix of ice and water.');

-- Sample Data Insertion for Employees Table
INSERT INTO Employees (firstName, lastName, position, hireDate, salary, habitatID) VALUES
('Jack', 'Daniels', 'Manager', '2022-01-01', 50000.00, 1),
('Allison', 'Smith', 'Zookeeper', '2020-12-15', 35000.00, 2),
('Alice', 'Johnson', 'Trainer', '2019-06-20', 40000.00, 3);

-- Sample Data Insertion for Shows Table
INSERT INTO Shows (showName, date, startTime, endTime, ticketPrice, habitatID) VALUES
('Penguin Diving', '2023-11-25', '10:00:00', '11:00:00', 15.00, 1),
('Ice Slide', '2023-12-02', '14:00:00', '15:00:00', 20.00, 2),
('Feeding Frenzy', '2023-12-09', '12:00:00', '13:00:00', 10.00, 3);

-- Sample Data Insertion for Penguins Table
INSERT INTO Penguins (name, dateOfBirth, sex, species, habitatID) VALUES
('Penny', '2018-05-10', 0, 'Emperor', 2),
('Pingu', '2017-03-15', 1, 'King', 1),
('Noot', '2019-08-20', 1, 'Adelie', 3),
('Sam', '2015-07-01', 0, 'Emperor', 1),
('Mary', '2021-01-19', 1, 'King', 1);

-- Sample Data Insertion for Employees_Shows Intersection Table
INSERT INTO Employees_Shows (employeeID, showID) VALUES
(1, 1),
(2, 2),
(3, 3);

-- Sample Data Insertion for Penguins_Shows Intersection Table
INSERT INTO Penguins_Shows (penguinID, showID) VALUES
(1, 1),
(2, 2),
(3, 3);

SET FOREIGN_KEY_CHECKS=1;
COMMIT;

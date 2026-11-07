using System;
using System.IO;
using System.Text;

namespace Computer_Program
{
    // ============================================================
    // class Student
    // One Student object keeps the data of one student:
    // name, total score and grade
    // ============================================================
    class Student
    {
        public string name;
        public double total;
        public string grade;

        // Constructor: this runs when we write "new Student(name, total)"
        public Student(string studentName, double studentTotal)
        {
            name = studentName;
            total = studentTotal;
            grade = CalGrade(studentTotal);
        }

        // Change total score into a grade
        // private = only the Student class can use this method
        private string CalGrade(double t)
        {
            if (t >= 80)
            {
                return "A";
            }
            else if (t >= 75)
            {
                return "B+";
            }
            else if (t >= 70)
            {
                return "B";
            }
            else if (t >= 65)
            {
                return "C+";
            }
            else if (t >= 60)
            {
                return "C";
            }
            else if (t >= 55)
            {
                return "D+";
            }
            else if (t >= 50)
            {
                return "D";
            }
            else
            {
                return "F";
            }
        }
    }

    // ============================================================
    // class Program
    // The main program: menu, input, output, save and load
    // ============================================================
    class Program
    {
        static void Main(string[] args)
        {
            // Let the console show and read Thai language
            Console.OutputEncoding = Encoding.UTF8;
            Console.InputEncoding = Encoding.UTF8;

            int maxStudents = 50;                           // the biggest number of students
            Student[] students = new Student[maxStudents];  // array of class Student
            double[,] score = new double[maxStudents, 3];   // 2D array: [student, subject]
                                                            // subject 0 = work
                                                            // subject 1 = midterm
                                                            // subject 2 = final
            int count = 0;                                  // how many students we have now
            int menu = -1;

            ShowWelcome();   // show the welcome message one time when the program starts

            do
            {
                // ---------- Show menu ----------
                Console.WriteLine("----- Grading System -----");
                Console.WriteLine("1. Add students & scores");
                Console.WriteLine("2. Show score table");
                Console.WriteLine("3. Show grade chart");
                Console.WriteLine("4. Save to file");
                Console.WriteLine("5. Load from file");
                Console.WriteLine("6. How to use");
                Console.WriteLine("0. Exit");
                menu = ReadNumber("Choose menu: ", 0, 6);
                Console.WriteLine();

                switch (menu)
                {
                    // ---------- Menu 1: Add students ----------
                    case 1:
                        if (count == maxStudents)
                        {
                            Console.WriteLine("Student list is full");
                        }
                        else
                        {
                            int spaceLeft = maxStudents - count;
                            int add = ReadNumber("Number of students to add: ", 1, spaceLeft);

                            // start at "count" so we add after the old students
                            for (int i = count; i < count + add; i++)
                            {
                                Console.WriteLine("--Student " + (i + 1) + "--");

                                string name = ReadName("Enter name: ");
                                double work = ReadScore("Enter work score: ");
                                double mid = ReadScore("Enter midterm score: ");
                                double fin = ReadScore("Enter final score: ");

                                // keep the 3 scores in the 2D array
                                score[i, 0] = work;
                                score[i, 1] = mid;
                                score[i, 2] = fin;

                                // make a new Student object
                                double total = CalTotal(work, mid, fin);
                                students[i] = new Student(name, total);
                            }

                            count = count + add;
                        }
                        break;

                    // ---------- Menu 2: Show score table ----------
                    case 2:
                        if (count == 0)
                        {
                            Console.WriteLine("No data yet");
                        }
                        else
                        {
                            // PadRight(20) adds spaces until the text is 20 characters long
                            Console.WriteLine("Name".PadRight(20) + "\tWork\tMid\tFinal\tTotal\tGrade");

                            for (int i = 0; i < count; i++)
                            {
                                string name = students[i].name.PadRight(20);
                                double work = score[i, 0];
                                double mid = score[i, 1];
                                double fin = score[i, 2];
                                double total = students[i].total;
                                string grade = students[i].grade;

                                Console.WriteLine(name + "\t" + work + "\t" + mid + "\t" + fin + "\t" + total + "\t" + grade);
                            }
                        }
                        break;

                    // ---------- Menu 3: Show grade chart ----------
                    case 3:
                        if (count == 0)
                        {
                            Console.WriteLine("No data yet");
                        }
                        else
                        {
                            string[] gradeList = { "A", "B+", "B", "C+", "C", "D+", "D", "F" };

                            // outer loop: go through each grade
                            for (int g = 0; g < gradeList.Length; g++)
                            {
                                Console.Write(gradeList[g] + "\t: ");

                                // inner loop: check every student, print * if the grade is the same
                                for (int i = 0; i < count; i++)
                                {
                                    if (students[i].grade == gradeList[g])
                                    {
                                        Console.Write("*");
                                    }
                                }

                                Console.WriteLine();
                            }
                        }
                        break;

                    // ---------- Menu 4: Save to file ----------
                    case 4:
                        if (count == 0)
                        {
                            // do not save, or the old file will become empty
                            Console.WriteLine("No data to save");
                        }
                        else
                        {
                            StreamWriter writer = new StreamWriter("students.txt");

                            // one student = one line, like this: Somchai,80,90,95
                            for (int i = 0; i < count; i++)
                            {
                                string line = students[i].name + "," + score[i, 0] + "," + score[i, 1] + "," + score[i, 2];
                                writer.WriteLine(line);
                            }

                            writer.Close();
                            Console.WriteLine("Saved " + count + " students");
                        }
                        break;

                    // ---------- Menu 5: Load from file ----------
                    case 5:
                        if (File.Exists("students.txt") == false)
                        {
                            Console.WriteLine("File not found. Please save first.");
                        }
                        else
                        {
                            StreamReader reader = new StreamReader("students.txt");
                            count = 0;

                            string line = reader.ReadLine();
                            while (line != null && count < maxStudents)
                            {
                                // Split cuts the line at every comma
                                // "Somchai,80,90,95" -> part[0]="Somchai", part[1]="80", part[2]="90", part[3]="95"
                                string[] part = line.Split(',');

                                string name = part[0];
                                double work = double.Parse(part[1]);
                                double mid = double.Parse(part[2]);
                                double fin = double.Parse(part[3]);

                                score[count, 0] = work;
                                score[count, 1] = mid;
                                score[count, 2] = fin;

                                double total = CalTotal(work, mid, fin);
                                students[count] = new Student(name, total);

                                count = count + 1;
                                line = reader.ReadLine();   // read the next line
                            }

                            reader.Close();
                            Console.WriteLine("Loaded " + count + " students");
                        }
                        break;

                    // ---------- Menu 6: How to use ----------
                    case 6:
                        ShowHelp();
                        break;

                    // ---------- Menu 0: Exit ----------
                    case 0:
                        Console.WriteLine("Bye Bye Luk na jub jub A+ pls");
                        break;
                }

                Console.WriteLine();
            } while (menu != 0);
        }

        // ============================================================
        // Welcome message: shown one time when the program starts
        // ============================================================
        static void ShowWelcome()
        {
            Console.WriteLine("==========================================");
            Console.WriteLine("     Welcome to the Grading System");
            Console.WriteLine("==========================================");
            Console.WriteLine("This program helps teachers calculate");
            Console.WriteLine("total scores and grades for students.");
            Console.WriteLine();
            Console.WriteLine("How the total score is calculated:");
            Console.WriteLine("  Work    30%");
            Console.WriteLine("  Midterm 30%");
            Console.WriteLine("  Final   40%");
            Console.WriteLine();
            Console.WriteLine("Grade criteria:");
            Console.WriteLine("  A  : 80 or more");
            Console.WriteLine("  B+ : 75 or more");
            Console.WriteLine("  B  : 70 or more");
            Console.WriteLine("  C+ : 65 or more");
            Console.WriteLine("  C  : 60 or more");
            Console.WriteLine("  D+ : 55 or more");
            Console.WriteLine("  D  : 50 or more");
            Console.WriteLine("  F  : less than 50");
            Console.WriteLine();
            Console.WriteLine("New here? Choose menu 6 to see how to use.");
            Console.WriteLine("==========================================");
            Console.WriteLine();
        }

        // ============================================================
        // Help page: explains every menu (menu 6)
        // ============================================================
        static void ShowHelp()
        {
            Console.WriteLine("============== How to use ==============");
            Console.WriteLine();
            Console.WriteLine("1. Add students & scores");
            Console.WriteLine("   Type how many students you want to add.");
            Console.WriteLine("   Then type each student's name and 3 scores:");
            Console.WriteLine("   work, midterm and final (each score is 0 - 100).");
            Console.WriteLine("   New students are added after the old ones.");
            Console.WriteLine("   You can keep up to 50 students.");
            Console.WriteLine();
            Console.WriteLine("2. Show score table");
            Console.WriteLine("   Shows every student's scores, total and grade.");
            Console.WriteLine();
            Console.WriteLine("3. Show grade chart");
            Console.WriteLine("   Shows how many students got each grade.");
            Console.WriteLine("   One * means one student.");
            Console.WriteLine();
            Console.WriteLine("4. Save to file");
            Console.WriteLine("   Saves all students to the file students.txt.");
            Console.WriteLine("   The old file will be replaced.");
            Console.WriteLine();
            Console.WriteLine("5. Load from file");
            Console.WriteLine("   Loads students from students.txt.");
            Console.WriteLine("   Warning: students that are not saved yet will be lost.");
            Console.WriteLine();
            Console.WriteLine("6. How to use");
            Console.WriteLine("   Shows this page.");
            Console.WriteLine();
            Console.WriteLine("0. Exit");
            Console.WriteLine("   Closes the program.");
            Console.WriteLine("   Remember to save (menu 4) before you exit!");
            Console.WriteLine();
            Console.WriteLine("Tip: if you type something wrong, the program");
            Console.WriteLine("will tell you and ask again.");
            Console.WriteLine("========================================");
        }

        // ============================================================
        // Read a whole number between min and max.
        // If the user types a wrong value, ask again.
        // ============================================================
        static int ReadNumber(string text, int min, int max)
        {
            int number = 0;
            bool valid = false;

            while (valid == false)
            {
                Console.Write(text);
                string input = Console.ReadLine();

                // TryParse gives true if input is a number, false if not (no crash)
                bool isNumber = int.TryParse(input, out number);

                if (isNumber == false)
                {
                    Console.WriteLine("Please enter a number only");
                }
                else if (number < min || number > max)
                {
                    Console.WriteLine("Please enter a number from " + min + " to " + max);
                }
                else
                {
                    valid = true;
                }
            }

            return number;
        }

        // ============================================================
        // Read a score between 0 and 100.
        // If the user types a wrong value, ask again.
        // ============================================================
        static double ReadScore(string text)
        {
            double number = 0;
            bool valid = false;

            while (valid == false)
            {
                Console.Write(text);
                string input = Console.ReadLine();

                bool isNumber = double.TryParse(input, out number);

                if (isNumber == false)
                {
                    Console.WriteLine("Please enter a number only");
                }
                else if (number >= 0 && number <= 100)
                {
                    valid = true;
                }
                else
                {
                    Console.WriteLine("Score must be 0 - 100");
                }
            }

            return number;
        }

        // ============================================================
        // Read a student name. The name cannot be empty.
        // ============================================================
        static string ReadName(string text)
        {
            string name = "";

            while (name == "")
            {
                Console.Write(text);
                name = Console.ReadLine();
                name = name.Trim();   // remove spaces at the start and the end

                if (name == "")
                {
                    Console.WriteLine("Name cannot be empty");
                }
            }

            // the file uses "," to separate data, so we change "," in the name to a space
            name = name.Replace(",", " ");
            return name;
        }

        // ============================================================
        // Calculate total score: work 30%, midterm 30%, final 40%
        // ============================================================
        static double CalTotal(double work, double mid, double fin)
        {
            double total = (work * 0.3) + (mid * 0.3) + (fin * 0.4);
            total = Math.Round(total, 2);   // keep 2 decimal places
            return total;
        }
    }
}

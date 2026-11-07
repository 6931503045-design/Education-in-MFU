using System;
using System.IO;
using System.Text;

namespace Computer_Program
{
    // One object = one student (name, total score, grade)
    class Student
    {
        public string name;
        public double total;
        public string grade;

        // Constructor: runs when we write "new Student(...)"
        public Student(string n, double t)
        {
            name = n;
            total = t;
            grade = CalGrade(t);
        }

        // private = only this class can use it
        private string CalGrade(double t)
        {
            if (t >= 80)
                return "A";
            else if (t >= 75)
                return "B+";
            else if (t >= 70)
                return "B";
            else if (t >= 65)
                return "C+";
            else if (t >= 60)
                return "C";
            else if (t >= 55)
                return "D+";
            else if (t >= 50)
                return "D";
            else
                return "F";
        }
    }

    class Program
    {
        static void Main(string[] args)
        {
            // Let the console show and read Thai (and other languages)
            Console.OutputEncoding = Encoding.UTF8;
            Console.InputEncoding = Encoding.UTF8;

            Student[] students = new Student[50]; // array of class
            double[,] score = new double[50, 3];  // column 0 = work, 1 = midterm, 2 = final
            int count = 0;
            int menu;

            do
            {
                Console.WriteLine("----- Grading System -----");
                Console.WriteLine("1. Add students & scores");
                Console.WriteLine("2. Show score table");
                Console.WriteLine("3. Show grade chart");
                Console.WriteLine("4. Save to file");
                Console.WriteLine("5. Load from file");
                Console.WriteLine("0. Exit");
                menu = ReadNumber("Choose menu: ", 0, 5);
                Console.WriteLine();

                switch (menu)
                {
                    case 1:
                        if (count == 50)
                        {
                            Console.WriteLine("Student list is full");
                            break;
                        }
                        int add = ReadNumber("Number of students to add: ", 1, 50 - count);
                        for (int i = count; i < count + add; i++)
                        {
                            Console.WriteLine("--Student " + (i + 1) + "--");
                            Console.Write("Enter name: ");
                            string n = Console.ReadLine().Replace(",", " ");
                            score[i, 0] = ReadScore("Enter work score: ");
                            score[i, 1] = ReadScore("Enter midterm score: ");
                            score[i, 2] = ReadScore("Enter final score: ");
                            double t = CalTotal(score[i, 0], score[i, 1], score[i, 2]);
                            students[i] = new Student(n, t);
                        }
                        count = count + add;
                        break;

                    case 2:
                        if (count == 0)
                        {
                            Console.WriteLine("No data yet");
                            break;
                        }
                        Console.WriteLine("Name".PadRight(15) + "\tWork\tMid\tFinal\tTotal\tGrade");
                        for (int i = 0; i < count; i++)
                        {
                            Console.WriteLine(students[i].name.PadRight(15) + "\t" + score[i, 0] + "\t" + score[i, 1] + "\t"
                                + score[i, 2] + "\t" + students[i].total + "\t" + students[i].grade);
                        }
                        break;

                    case 3:
                        if (count == 0)
                        {
                            Console.WriteLine("No data yet");
                            break;
                        }
                        string[] list = { "A", "B+", "B", "C+", "C", "D+", "D", "F" };
                        for (int i = 0; i < list.Length; i++)
                        {
                            Console.Write(list[i] + "\t: ");
                            for (int j = 0; j < count; j++)
                            {
                                if (students[j].grade == list[i])
                                    Console.Write("*");
                            }
                            Console.WriteLine();
                        }
                        break;

                    case 4:
                        StreamWriter sw = new StreamWriter("students.txt");
                        for (int i = 0; i < count; i++)
                        {
                            sw.WriteLine(students[i].name + "," + score[i, 0] + "," + score[i, 1] + "," + score[i, 2]);
                        }
                        sw.Close();
                        Console.WriteLine("Saved " + count + " students");
                        break;

                    case 5:
                        if (!File.Exists("students.txt"))
                        {
                            Console.WriteLine("File not found. Please save first.");
                            break;
                        }
                        StreamReader sr = new StreamReader("students.txt");
                        count = 0;
                        string line = sr.ReadLine();
                        while (line != null && count < 50)
                        {
                            string[] part = line.Split(',');
                            score[count, 0] = double.Parse(part[1]);
                            score[count, 1] = double.Parse(part[2]);
                            score[count, 2] = double.Parse(part[3]);
                            double t = CalTotal(score[count, 0], score[count, 1], score[count, 2]);
                            students[count] = new Student(part[0], t);
                            count++;
                            line = sr.ReadLine();
                        }
                        sr.Close();
                        Console.WriteLine("Loaded " + count + " students");
                        break;

                    case 0:
                        Console.WriteLine("Bye Bye Luk na jub jub A+ pls");
                        break;
                }
                Console.WriteLine();
            } while (menu != 0);
        }

        // Read a whole number between min and max. Ask again if input is wrong.
        static int ReadNumber(string text, int min, int max)
        {
            int n;
            Console.Write(text);
            while (!int.TryParse(Console.ReadLine(), out n) || n < min || n > max)
            {
                Console.WriteLine("Please enter a number " + min + " - " + max);
                Console.Write(text);
            }
            return n;
        }

        // Read a score between 0 and 100. Ask again if input is wrong.
        static double ReadScore(string text)
        {
            double s;
            Console.Write(text);
            while (!double.TryParse(Console.ReadLine(), out s) || s < 0 || s > 100)
            {
                Console.WriteLine("Score must be 0 - 100");
                Console.Write(text);
            }
            return s;
        }

        static double CalTotal(double w, double m, double f)
        {
            double sum = (w * 0.3) + (m * 0.3) + (f * 0.4);
            return Math.Round(sum, 2);
        }
    }
}

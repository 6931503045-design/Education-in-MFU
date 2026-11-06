using System;
using System.IO;

namespace Computer_Program
{
    class Program
    {
        const int MAX = 50;                     // max number of students
        const string FILE_NAME = "students.txt"; // file for save/load

        // column index for the 2D array score[student, column]
        const int WORK = 0;
        const int MID = 1;
        const int FIN = 2;

        static void Main(string[] args)
        {
            string[] name = new string[MAX];
            double[,] score = new double[MAX, 3]; // 2D array: [student, work/mid/final]
            double[] total = new double[MAX];
            string[] grade = new string[MAX];
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
                menu = ReadInt("Choose menu: ", 0, 5);
                Console.WriteLine();

                switch (menu)
                {
                    case 1:
                        count = AddStudents(name, score, total, grade, count);
                        break;

                    case 2:
                        ShowTable(name, score, total, grade, count);
                        break;

                    case 3:
                        ShowChart(grade, count);
                        break;

                    case 4:
                        SaveFile(name, score, count);
                        break;

                    case 5:
                        count = LoadFile(name, score, total, grade, count);
                        break;

                    case 0:
                        Console.WriteLine("Bye Bye Luk na jub jub A+ pls");
                        break;
                }
                Console.WriteLine();
            } while (menu != 0);
        }

        // ---------- Input helpers ----------

        // Read an integer in range [min, max]. Never crashes on bad input.
        static int ReadInt(string text, int min, int max)
        {
            int n;
            while (true)
            {
                Console.Write(text);
                if (int.TryParse(Console.ReadLine(), out n) && n >= min && n <= max)
                    return n;
                Console.WriteLine("Please enter a number from " + min + " to " + max);
            }
        }

        // Read a score 0 - 100. Never crashes on bad input.
        static double ReadScore(string text)
        {
            double s;
            while (true)
            {
                Console.Write(text);
                if (double.TryParse(Console.ReadLine(), out s) && s >= 0 && s <= 100)
                    return s;
                Console.WriteLine("Score must be a number 0 - 100");
            }
        }

        // Read a non-empty name. Comma is not allowed because the file uses comma as separator.
        static string ReadName(string text)
        {
            while (true)
            {
                Console.Write(text);
                string s = Console.ReadLine();
                if (s != null)
                    s = s.Trim();
                if (string.IsNullOrEmpty(s))
                    Console.WriteLine("Name cannot be empty");
                else if (s.Contains(","))
                    Console.WriteLine("Name cannot contain ','");
                else
                    return s;
            }
        }

        // ---------- Menu actions ----------

        // Add new students after the existing ones. Returns the new count.
        static int AddStudents(string[] name, double[,] score, double[] total, string[] grade, int count)
        {
            if (count >= MAX)
            {
                Console.WriteLine("Student list is full (" + MAX + " students)");
                return count;
            }

            int add = ReadInt("Number of students to add (1 - " + (MAX - count) + "): ", 1, MAX - count);
            for (int i = count; i < count + add; i++)
            {
                Console.WriteLine("--Student " + (i + 1) + "--");
                name[i] = ReadName("Enter name: ");
                score[i, WORK] = ReadScore("Enter work score: ");
                score[i, MID] = ReadScore("Enter midterm score: ");
                score[i, FIN] = ReadScore("Enter final score: ");
                total[i] = CalTotal(score[i, WORK], score[i, MID], score[i, FIN]);
                grade[i] = CalGrade(total[i]);
            }
            return count + add;
        }

        static void ShowTable(string[] name, double[,] score, double[] total, string[] grade, int count)
        {
            if (count == 0)
            {
                Console.WriteLine("No data yet. Please add or load students first.");
                return;
            }

            // {0,-15} = left align 15 chars, {1,7} = right align 7 chars
            Console.WriteLine("{0,-15}{1,7}{2,7}{3,7}{4,8}{5,7}", "Name", "Work", "Mid", "Final", "Total", "Grade");
            for (int i = 0; i < count; i++)
            {
                Console.WriteLine("{0,-15}{1,7}{2,7}{3,7}{4,8}{5,7}",
                    name[i], score[i, WORK], score[i, MID], score[i, FIN], total[i], grade[i]);
            }
        }

        static void ShowChart(string[] grade, int count)
        {
            if (count == 0)
            {
                Console.WriteLine("No data yet. Please add or load students first.");
                return;
            }

            string[] list = { "A", "B+", "B", "C+", "C", "D+", "D", "F" };
            for (int i = 0; i < list.Length; i++)
            {
                Console.Write("{0,-3}: ", list[i]);
                for (int j = 0; j < count; j++)
                {
                    if (grade[j] == list[i])
                        Console.Write("*");
                }
                Console.WriteLine();
            }
        }

        // ---------- File I/O ----------

        // Save each student as one line: name,work,mid,final
        static void SaveFile(string[] name, double[,] score, int count)
        {
            if (count == 0)
            {
                Console.WriteLine("No data to save.");
                return;
            }

            try
            {
                using (StreamWriter sw = new StreamWriter(FILE_NAME))
                {
                    for (int i = 0; i < count; i++)
                    {
                        sw.WriteLine(name[i] + "," + score[i, WORK] + "," + score[i, MID] + "," + score[i, FIN]);
                    }
                }
                Console.WriteLine("Saved " + count + " students to " + FILE_NAME);
            }
            catch (Exception e)
            {
                Console.WriteLine("Cannot save file: " + e.Message);
            }
        }

        // Load students from file (replaces current data). Returns the new count.
        // If the file is missing, keep the old data and return the old count.
        static int LoadFile(string[] name, double[,] score, double[] total, string[] grade, int oldCount)
        {
            if (!File.Exists(FILE_NAME))
            {
                Console.WriteLine("File " + FILE_NAME + " not found. Please save first.");
                return oldCount;
            }

            int count = 0;
            int skipped = 0;
            try
            {
                using (StreamReader sr = new StreamReader(FILE_NAME))
                {
                    string line;
                    while ((line = sr.ReadLine()) != null && count < MAX)
                    {
                        string[] part = line.Split(',');
                        double w, m, f;
                        if (part.Length == 4
                            && double.TryParse(part[1], out w)
                            && double.TryParse(part[2], out m)
                            && double.TryParse(part[3], out f))
                        {
                            name[count] = part[0];
                            score[count, WORK] = w;
                            score[count, MID] = m;
                            score[count, FIN] = f;
                            total[count] = CalTotal(w, m, f);
                            grade[count] = CalGrade(total[count]);
                            count++;
                        }
                        else
                        {
                            skipped++; // broken line, ignore it
                        }
                    }
                }
                Console.WriteLine("Loaded " + count + " students from " + FILE_NAME);
                if (skipped > 0)
                    Console.WriteLine("Skipped " + skipped + " invalid line(s)");
            }
            catch (Exception e)
            {
                Console.WriteLine("Cannot load file: " + e.Message);
            }
            return count;
        }

        // ---------- Calculation ----------

        static double CalTotal(double w, double m, double f)
        {
            double sum = (w * 0.3) + (m * 0.3) + (f * 0.4);
            return Math.Round(sum, 2);
        }

        static string CalGrade(double t)
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
}

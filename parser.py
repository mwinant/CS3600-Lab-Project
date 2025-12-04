import requests
from bs4 import BeautifulSoup
import re
import json

program = "CS"
year = "2025"
semester = "fall"
if semester.lower() == "fall":
    semester = "10"
elif semester.lower() == "winter":
    semester = "15"
elif semester.lower() == "spring":
    semester = "20"
elif semester.lower() == "summer":
    semester = "30"
else:
    raise ValueError("Semester must be 'fall', 'spring', or 'summer'")

url = f"https://www.webpages.uidaho.edu/schedule/{year}{semester}{program}.htm"
r = requests.get(url)
soup = BeautifulSoup(r.text, 'html.parser')

courses = []
rows = soup.find_all('tr')

i = 0
while i < len(rows):
    cells = rows[i].find_all('td')
    
    # Check if this is a course header row (has CRN, Subject, Course Number)
    if len(cells) > 5 and cells[0].get_text(strip=True).isdigit():
        crn = cells[0].get_text(strip=True)
        subject = cells[1].get_text(strip=True)
        course_num = cells[2].get_text(strip=True)
        section = cells[3].get_text(strip=True)
        title = cells[5].get_text(strip=True)
        
        # Next row should have dates and times
        if i + 1 < len(rows):
            next_cells = rows[i + 1].find_all('td')
            if len(next_cells) > 5:
                start_date = next_cells[2].get_text(strip=True)
                end_date = next_cells[3].get_text(strip=True)
                times = next_cells[4].get_text(strip=True)
                days = next_cells[5].get_text(strip=True)
                
                # Skip TBA courses
                if 'TBA' in times.upper() or 'TBA' in days.upper():
                    i += 1
                    continue
                
                # Normalize days: T->tu, R->th, MWF->m w f
                days_normalized = days.replace('T', 'tu').replace('R', 'th')
                # Convert uppercase MWF to lowercase m w f
                days_normalized = days_normalized.replace('M', 'm').replace('W', 'w').replace('F', 'f')
                
                # Parse times
                time_match = re.match(r'(\d{1,2}:\d{2}\s*(?:am|pm))\s*-\s*(\d{1,2}:\d{2}\s*(?:am|pm))', times, re.IGNORECASE)
                start_time = time_match.group(1) if time_match else ""
                end_time = time_match.group(2) if time_match else ""
                
                # Determine semester from dates
                season = "Spring" if "Jan" in start_date or "Feb" in start_date or "Mar" in start_date else "Fall"
                
                # Extract year from dates (e.g., "Jan 14, 2026" -> 2026)
                year_match = re.search(r'(\d{4})', start_date)
                year = year_match.group(1) if year_match else "2026"
                
                semester = f"{season} {year}"
                
                # Convert dates from "Jan 14, 2026" format to "2026-01-14" format
                def convert_date_format(date_str):
                    """Convert 'Jan 14, 2026' to '2026-01-14'"""
                    months = {
                        'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04',
                        'May': '05', 'Jun': '06', 'Jul': '07', 'Aug': '08',
                        'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
                    }
                    match = re.search(r'(\w+)\s+(\d{1,2}),?\s+(\d{4})', date_str)
                    if match:
                        month = match.group(1)
                        day = match.group(2).zfill(2)
                        year = match.group(3)
                        month_num = months.get(month, '01')
                        return f"{year}-{month_num}-{day}"
                    return date_str
                
                converted_start_date = convert_date_format(start_date)
                converted_end_date = convert_date_format(end_date)
                
                course = {
                    'title': title,
                    'days': days_normalized,
                    'start_time': start_time,
                    'end_time': end_time,
                    'start_date': converted_start_date,
                    'end_date': converted_end_date,
                    'semester': semester
                }
                courses.append(course)
    
    i += 1

# Count occurrences of each title and add numbering
title_counts = {}
for course in courses:
    title = course['title']
    title_counts[title] = title_counts.get(title, 0) + 1

# Add numbering to courses with duplicate titles
title_indices = {}
for course in courses:
    title = course['title']
    if title_counts[title] > 1:
        title_indices[title] = title_indices.get(title, 0) + 1
        course['title'] = f"{title} -{title_indices[title]}"

# Print first few courses
print(f"Found {len(courses)} courses\n")
for i, course in enumerate(courses):
    print(f"Course {i+1}:")
    for key, value in course.items():
        print(f"  {key}: {value}")
    print()

# Save to JSON file
output_file = 'courses.json'
with open(output_file, 'w') as f:
    json.dump(courses, f, indent=2)
print(f"\nSaved {len(courses)} courses to {output_file}")

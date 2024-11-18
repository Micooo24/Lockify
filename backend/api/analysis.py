# This will be used for the Entropy calculation
import math
import hashlib
import requests
import regex as re

def calculate_entropy(password):
    """Calculate password entropy in bits."""
    length = len(password)
    pool_size = 0

    # Estimate pool size based on character types
    if any(c.islower() for c in password): pool_size += 26
    if any(c.isupper() for c in password): pool_size += 26
    if any(c.isdigit() for c in password): pool_size += 10
    if any(c in '!@#$%^&*()-_=+[]{};:,.<>/?' for c in password): pool_size += 32  # Special chars

    # Entropy formula: length * log2(pool_size)
    entropy = length * math.log2(pool_size) if pool_size > 0 else 0
    return entropy

# Function to check if a password has been pwned and get its breach count
def pwned_api_check(password):
    sha1password = hashlib.sha1(password.encode('utf-8')).hexdigest().upper()
    first5_char, tail = sha1password[:5], sha1password[5:]
    
    url = 'https://api.pwnedpasswords.com/range/' + first5_char
    res = requests.get(url)
    if res.status_code != 200:
        raise RuntimeError(f'Error fetching: {res.status_code}, check the API and try again')
    
    hashes = (line.split(':') for line in res.text.splitlines())
    for h, count in hashes:
        if h == tail:
            return int(count)
    return 0
leet_map = {"a": ["@", "4"], "o": ["0"], "s": ["$", "5"], "e": ["3"], "l": ["1"]}
#to revert leetspeak back to its orig form
def revert_leetspeak(password, leet_map):

    for char, subs in leet_map.items():
        for sub in subs:
            if sub in password:
                password = password.replace(sub, char)
    return password

# Pattern analysis functions
def detect_repeating(password):
   
    return bool(re.search(r"(.)\1{2,}", password)) 

def detect_sequential(password):
   
    for i in range(len(password) - 2):
       
        if (password[i].isdigit() and password[i+1].isdigit() and password[i+2].isdigit()):
            if (int(password[i+1]) - int(password[i]) == 1 and 
                int(password[i+2]) - int(password[i+1]) == 1):
                return True
        elif (password[i].isalpha() and password[i+1].isalpha() and password[i+2].isalpha()):
            
            curr = ord(password[i].lower())
            next1 = ord(password[i+1].lower())
            next2 = ord(password[i+2].lower())
            if (next1 - curr == 1 and next2 - next1 == 1):
                return True
    return False

def detect_keyboard_pattern(password):
    # Standard US QWERTY keyboard layout
    keyboard_layout = [
        ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
        ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
        ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';'],
        ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/']
    ]
    
    
    char_positions = {}
    for row_idx, row in enumerate(keyboard_layout):
        for col_idx, char in enumerate(row):
            char_positions[char] = (row_idx, col_idx)
    
    def is_adjacent(pos1, pos2):
        if pos1 is None or pos2 is None:
            return False
        row1, col1 = pos1
        row2, col2 = pos2
        
        return (abs(row1 - row2) <= 1 and abs(col1 - col2) <= 1)
    
    
    password = password.lower()
    min_sequence = 4
    
    for i in range(len(password) - min_sequence + 1):
        sequence = password[i:i + min_sequence]
        positions = []
        valid_chars = True
        
        for char in sequence:
            if char not in char_positions:
                valid_chars = False
                break
            positions.append(char_positions[char])
            
        if not valid_chars:
            continue
            
        valid_sequence = True
        for j in range(len(positions) - 1):
            if not is_adjacent(positions[j], positions[j + 1]):
                valid_sequence = False
                break
                
        if valid_sequence:
            return True
            
    return False

def detect_common_pass(password):
  
    breach_count = pwned_api_check(password)
    return breach_count

def detect_mirrored(password):
  
    return password == password[::-1]

def estimate_cracking_time(entropy, password):
  
    # 10 billion guesses per second
    cracking_speed = 10e9

    # Time to crack = (2^(entropy in bits)) / cracking speed
    cracking_time = (2 ** entropy) / cracking_speed
    intervals = [
        ('years', 60 * 60 * 24 * 365),
        ('days', 60 * 60 * 24),
        ('hours', 60 * 60),
        ('minutes', 60),
        ('seconds', 1),
    ]

    result = []
    breach_count = detect_common_pass(password)
    if not (breach_count > 0 or detect_repeating(password) or detect_sequential(password) or detect_keyboard_pattern(password) or detect_mirrored(password) or revert_leetspeak(password, leet_map)):
        for name, count in intervals:
            value = cracking_time // count
            if value:
                cracking_time -= value * count
                result.append(f"{int(value)} {name}")
        return ', '.join(result) if result else "0 seconds"
    else:
        return "Password breached / Belonged to a pattern - Cracking time irrelevant"
    
def remarks(password):
    """Analyze password and return remarks."""
    remarks = []

    # Check for common passwords
    breach_count = detect_common_pass(password)
    if breach_count > 0:
        remarks.append(f"Password breached {breach_count} times")
    else:
        remarks.append("Password not breached")

    # Check for repeating characters
    if detect_repeating(password):
        remarks.append("Password contains repeating characters")
    else:
        remarks.append("Password does not contain repeating characters")

    # Check for sequential characters
    if detect_sequential(password):
        remarks.append("Password contains sequential characters")
    else:
        remarks.append("Password does not contain sequential characters")

    # Check for keyboard patterns
    if detect_keyboard_pattern(password):
        remarks.append("Password contains keyboard pattern")
    else:
        remarks.append("Password does not contain keyboard pattern")

    # Check for mirrored passwords
    if detect_mirrored(password):
        remarks.append("Password is a mirrored string")
    else:
        remarks.append("Password is not a mirrored string")
    
    if revert_leetspeak(password, leet_map) :
        remarks.append("Password contains leetspeak")
    else:
        remarks.append("Password does not contain leetspeak")

    return remarks
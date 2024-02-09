def extract_days(business_hours):
    # Split the string on the comma
    parts = business_hours.split(",")

    # The first part should contain the days
    days = parts[0]

    return days


def get_days_in_range(day_range):
    days = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
    ]
    if "&" in day_range:
        start_day, end_day = day_range.split(" & ")
    elif "-" in day_range:
        start_day, end_day = day_range.split(" - ")
    else:
        return [day_range]

    start_index = days.index(start_day)
    end_index = days.index(end_day)

    if start_index <= end_index:
        return days[start_index : end_index + 1]
    else:
        return days[start_index:] + days[: end_index + 1]


def get_included_days(business_hours):
    days = extract_days(business_hours)
    days = get_days_in_range(days)
    return days


# Test the function
business_hours1 = "Sunday - Thursday, 10:00 AM – 10:00PM"
business_hours2 = "Friday & Saturday, 10:00 AM – 10:30PM"
business_hours3 = "Sunday, Closed"


print(get_included_days(business_hours1))  # Outputs: Sunday - Thursday
print(get_included_days(business_hours2))  # Outputs: Friday & Saturday
print(get_included_days(business_hours3))

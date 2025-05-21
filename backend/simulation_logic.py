import time
import requests
import openmeteo_requests
from retry_requests import retry
from dotenv import load_dotenv
import numpy as np
from google import genai
from google.genai import types
import os

# Configure the Gemini API with your token
# Use the API key from an environment variable for security
load_dotenv()
api_key = os.getenv("API_KEY")
gen_key = os.getenv("GEN_API")
genai_client = genai.Client(api_key = gen_key)


def extract_lat_lng(input_address, data_type='json'):
    """
    Purpose: Extracts latitude and longitude from an address using Google Geocoding API.
    """
    endpoint = f"https://maps.googleapis.com/maps/api/geocode/{data_type}" 
    params = {
        "address": input_address,
        "key": api_key
    }

    try:
        response = requests.get(endpoint, params=params)
        response.raise_for_status()

        data = response.json()
        if "results" in data and data["results"]:
            latlng = data["results"][0]["geometry"]["location"]
            return {"lat": latlng.get("lat"), 
                    "lon": latlng.get("lng"),
                    "name": input_address}
        else:
            return {"lat": 0.0, "lon": 0.0, "name": input_address}
        
    except Exception as e:
        return {"lat": 0.0, "lon": 0.0, "name": input_address}

def get_real_temperature(location):
    """
    Purpose: Get the current temperature for a location using Open-Meteo API.
    
    Inputs:
    - location: The address
            
    Output:
        Current temperature at the specified location
    """
    # Setting up the Open-Meteo API client
    cache_session = requests.session()
    retry_session = retry(cache_session, retries = 5, backoff_factor = 0.2)
    openmeteo = openmeteo_requests.Client(session = retry_session)
    location_data = extract_lat_lng(location)
    
    # API request url and parameters
    url = "https://api.open-meteo.com/v1/forecast"
    params = {
        "latitude": location_data["lat"],
        "longitude": location_data["lon"],
        "current": ["temperature_2m"],
        "timezone": "auto",
        "wind_speed_unit": "mph",
	    "precipitation_unit": "inch"
    }
    
    try:
        # Make the request
        responses = openmeteo.weather_api(url, params = params)
        response = responses[0]
        current = response.Current()
        current_temperature = current.Variables(0).Value()
        return current_temperature
    
    except:
        base_temp = 0.0
        return base_temp

def climate_api(start_year, end_year, location, policies):
    """
    Generate temperature projections based on policy choices and location data.
    
    Purpose:
    1. Projects future temperatures based on policy choices.
    2. Applies the effects of climate policies to modify temperature trajectories.
    
    Inputs:
        - start_year: The starting year for the simulation.
        - end_year: The ending year for the simulation.
        - location: The address
        - policies: Policy settings that affect temperature trajectories.
        
    Output:
        A list of projected temperatures for each year.
    """
    # Fetches the current temperature data for the starting point
    base_temperature = get_real_temperature(location)
    
    years = list(range(start_year, end_year + 1))
    
    # Calculate how policies affect temperature trajectory.
    # NOTE: This is a simplified model made after referencing few research papers and should be replaced with a trained and complex model in the future.

    ffp_multiplier = 0.00
    if policies["fossilFuelPhaseout"] == "fast":
        ffp_multiplier = 0.05
    elif policies["fossilFuelPhaseout"] == "medium":
        ffp_multiplier = 0.02
    else:
        ffp_multiplier = 0.01

    db_multiplier = 0.00
    if policies["deforestationBan"]:
        db_multiplier = 0.03
    else:
        db_multiplier = 0.00
    mitigation_factor = (
        policies["carbonTaxRate"] * 0.002 +                                 # Carbon tax reduces emissions
        policies["renewableSubsidy"] * 0.001 +                              # Renewable subsidies encourages clean energy
        ffp_multiplier +                                                    # The speed of fossil fuel phaseout matters
        db_multiplier +                                                     # Forests are carbon sinks
        policies["carbonCaptureRAndD"] * 0.004                              # Carbon capture technology helps remove CO2
    )
    
    """
    According to NASA's Earth Observatory, most of the global warming has occurred since 1975 at a rate of about 0.15 to 0.20°C per decade.
    This translates to an approximate increase of 0.02°C per year, which is used as an estimated annual increase in temperature rate in this dataset.
    """
    default_annual_increase = 0.02
    
    # Generate temperature trajectory with policy effects
    temperature_traj = []
    cumulative_miti = 0
    
    for i, year in enumerate(years):
        
        # Policies become more effective over time (cumulative effect)
        if i > 0:
            cumulative_miti += mitigation_factor * 0.02
        max_mitigation_ratio = 0.9
        year_increase = default_annual_increase - min(default_annual_increase * max_mitigation_ratio, cumulative_miti)

        # Random variation to simulate climate variability:
        # - Normal distribution adds realistic variability to the model
        # - The "0" in the mean indicates no bias towards warming or cooling
        # - The "0.34" in the standard deviation is chosen after referencing "https://www.soa.org/490646/globalassets/assets/files/resources/research-report/2024/cc212-actuarial-weather-extremes-2023-hottest-year.pdf"
        random_variation = np.random.normal(0, 0.34)
        
        # Calculate temperature for this year
        if i == 0:
            """ 
            For the first year:
            - Start with the actual observed current temperature at the given location.
            - Add a random variation to simulate natural climate variability and give it a realistic .
            - No increase from the mitigation effects yet.
            """
            temp = base_temperature + random_variation
        else:
            """
            For subsequent years:
            - Start from the previous year's simulated temperature.
            - Add the default yearly increase reduced by policy mitigation effects.
            - Add a random variation to simulate natural climate variability and give it a realistic feel.
            """
            temp = temperature_traj[-1] + year_increase + random_variation
    
        temperature_traj.append(round(temp, 4))
    
    return temperature_traj, years



def mock_gemini_api(scores):
    """
    Puprpose: Fallback when the real Gemini API is unavailable.

    Input:
        - scores: Dictionary containing the key performance metrics.

    Output:
        A string containing an AI-generated comment on the policy.
    """
    time.sleep(0.5)  # Simulate network delay
    
    comments = [
        f"Your policy achieves a carbon score of {scores['carbon_score']}, an economic pressure of {scores['economic_pressure']} and a justice score of {scores['justice_score']}. ",
        "To reduce economic strain while preserving climate benefits consider balancing tax measures with increased investment in adaptation. ",
    ]
    
    if scores['carbon_score'] < 60:
        comments.append("Your carbon reduction targets may be insufficient to meet climate goals. ")
    elif scores['economic_pressure'] > 70:
        comments.append("The current economic pressure is high, which may lead to resistance. ")
    elif scores['justice_score'] < 60:
        comments.append("Consider strengthening justice measures for vulnerable communities. ")
    
    return "".join(comments)


def gemini_api(policy_summary, scores, location):
    """
    Purpose: Get policy analysis from Google's Gemini API.
    
    Inputs:
        - policy_summary: A summary of the policy being evaluated.
        - scores: Dictionary containing key performance metrics in the format (Dict[str, int]).
        - location: The location name for which the policy in the simulation is being evaluated.
        
    Output:
        A string containing an AI-generated analysis of the policy.
    """
    try:
        # Create the prompt with all relevant context
        prompt = f"""
        Analyze this climate policy and provide advise for improvement.:
        
        Location: {location}
        
        Policy Summary: {policy_summary}
        
        Performance Metrics:
        - Carbon Reduction Score: {scores['carbon_score']}/100
        - Climate Justice Score: {scores['justice_score']}/100
        - Economic Pressure: {scores['economic_pressure']}/100
        
        Provide a concise analysis (3-5 sentences) that:
        1. Evaluates the effectiveness of this policy approach
        2. Identifies strengths and weaknesses
        3. Makes 1-2 specific recommendations for improvement
        4. Considers the specific challenges of the location
        """
        
        # Generate response using the newer client format
        response = genai_client.models.generate_content(
            model='gemini-2.0-flash-001',
            contents=prompt,
            config=types.GenerateContentConfig(
                temperature=0.2,
                max_output_tokens=1024,
            )
        )
        
        # Extract text from response
        analysis = response.text
            
        return analysis.strip()
        
    except:
        return mock_gemini_api(scores)

def analyze_policy_with_gemini(description, analysis_type):
    """
    Purpose: Analyzes a policy description using the Gemini API to identify strengths or weaknesses.

    Input:
        - description: The policy description to analyze.
        - analysis_type:  "strength" or "weakness"

    Output:
        A list of strings, where each string is a pointer.
    """
    prompt_text = f"""
    Analyze the following policy description and identify its main {analysis_type}es.
    Provide each {analysis_type} as a concise bullet point (max 90 characters each).
    Do not add any side headings or symbols like "*". Limit to 3 bullet points.

    Policy Description:
    {description}

    {analysis_type.title()}s:
    """
    try:
        response = genai_client.models.generate_content(
            model='gemini-2.0-flash-001',
            contents=prompt_text,
            config=types.GenerateContentConfig(
                temperature=0.2,
                max_output_tokens=1024,
            )
        )
        
        # Extract text from response
        analysis = response.text
            
        return analysis.strip()

    except:
        return ""

def gemini_improver(title, description):
    """
    Purpose: Improves the clarity and grammar of a climate policy description or, if missing, generates a concise description from the title.

    Inputs:
        - title: The title or name of the policy.
        - description: The description of the policy (may be empty).

    Output:
        A string with an improved or generated description.
    """
    if description and description.strip() and description.lower() != "none":
        prompt = (
            "Improve the clarity, grammar, and conciseness of the following climate policy description. "
            "Keep the meaning intact and provide only the improved description, without any extra explanation:\n\n"
            f"{description}"
        )
    else:
        prompt = (
            "Based on the following climate policy title, generate a clear, concise, and informative policy description. "
            "Provide only the description, without any extra explanation:\n\n"
            f"{title}"
        )

    try:
        response = genai_client.models.generate_content(
            model='gemini-2.0-flash-001',
            contents=prompt,
            config=types.GenerateContentConfig(
                temperature=0.2,
                max_output_tokens=500
            )
        )
        return response.text.strip()
    except:
        return ""


def calculate_policy_name(policies):
    """
    Purpose: Generates a policy name based on the policy settings.
    
    Input policies: The policy settings.
        
    Outputs: A descriptive name for the policy.
    """
    # Base cases for the policy name
    speed = ""
    focus = ""
    approach = ""
    
    # Speed determining component
    if policies["fossilFuelPhaseout"] == "fast":
        speed = "Rapid "
    elif policies["fossilFuelPhaseout"] == "slow":
        speed = "Gradual "
    
    # Focus detremining component
    if policies["justiceLensStrength"] >= 50:
        focus = "Justice-Centered "
    elif policies["renewableSubsidy"] >= 50:
        focus = "Renewable-Focused "
    elif policies["carbonTaxRate"] >= 100:
        focus = "Carbon-Priced "
    elif policies["adaptationInvestment"] >= 7:
        focus = "Adaptation-Ready "
    
    # Approach determining component
    if policies["carbonCaptureRAndD"] >= 7:
        approach = "Tech-Driven "
    elif policies["educationCampaigns"] >= 70:
        approach = "Awareness-Driven "
    elif policies["deforestationBan"] >= 7:
        approach = "Conservation-Driven "
    elif policies["greenJobsInitiative"] >= 7:
        approach = "Jobs-Driven "
    elif policies["industryRegulations"] == "high":
        approach = "Regulation-Driven "
    
    policy_name = f"{speed}{focus}{approach}Climate Strategy"
    
    # Fallback if we don't have an empty name
    if not policy_name.strip():
        policy_name = "Balanced Climate Strategy"
        
    return policy_name



def calculate_results(input_data):
    """
    Purpose: Calculates the results of the policy simulation based on the input parameters.

    Input: 
        - input_data: A dictionary containing the input parameters from the frontend.

    Output: A dictionary containing the simulation results.
    """
    start_year = input_data["startYear"]
    end_year = input_data["endYear"]
    location = input_data["location"]
    policies = input_data["policies"]
    policy_naming = input_data["policyName"]
    description = input_data["description"]




    ffp_score = 0       # Fossil fuel phaseout scoring
    ffp_pressure = 0    # Fossil fuel phaseout pressure
    if policies["fossilFuelPhaseout"] == "fast": # Fast fossil fuel phaseout create the most immediate climate benefit but also created the most economic disruption.
        ffp_score = 30
        ffp_pressure = 20
    elif policies["fossilFuelPhaseout"] == "medium": # Medium fossil fuel phaseout offers a balance between economic and climate benefits.
        ffp_score = 20
        ffp_pressure = 10
    elif policies["fossilFuelPhaseout"] == "slow": # Slow fossil fuel phaseout minimizes the economic disruption but delays the climate benefits.
        ffp_score = 15
        ffp_pressure = 5
    else: # Status quo provides with minimal climate benefits and economic disruption.
        ffp_score = 5 
        ffp_pressure = 5

    
    ir_score = 0    # Industry regulations scoring
    ir_pressure = 0 # Industry regulations pressure
    if policies["industryRegulations"] == "high": # High industry regulations drive innovation and emmisinos reduction but can be economically disruptive by increasing costs.
        ir_score = 15
        ir_pressure = 10
    elif policies["industryRegulations"] == "medium": # Medium industry regulations create incentives for innovation and emissions reduction
        ir_score = 10
        ir_pressure = 5
    else: # Low industry regulations create minimal economic disruption but has limited climate benefits.
        ir_score = 5
        ir_pressure = 0

    # Carbon reduction score
    carbon_score = (
        policies["carbonTaxRate"] * 0.3 +       # Carbon tax is a strong incentive for emissions reduction 
        policies["renewableSubsidy"] * 0.25 +   # Renewable subsidies encourage investment in clean energy and accelerate the transition away from fossil fuels
        ffp_score +                             # Fossil fuel phaseout directly reduces emissions
        policies["carbonCaptureRAndD"] * 3 +    # Carbon capture technology is a key part of the solution
        ir_score                                # Industry regulations drive innovation and emissions reduction
    )

    # Economic pressure score
    economic_pressure = (
        policies["carbonTaxRate"] * 0.25 +
        ffp_pressure +
        ir_pressure -
        policies["greenJobsInitiative"] * 2
    )
    
    # Justice score
    justice_score = (
        policies["justiceLensStrength"] * 0.5 + # Justice lens strength ensures that the policies are equitable and inclusive
        policies["deforestationBan"] * 0.2 +    # Deforestation ban protects carbon sinks and promotes biodiversity
        policies["educationCampaigns"] * 0.3 +  # Education campaigns raise awareness and promote community engagement
        policies["greenJobsInitiative"] * 4 +   # Green jobs initiative creates jobs in the clean energy sector
        policies["adaptationInvestment"] * 2    # Adaptation investment is crucial for protecting vulnerable communities from climate impacts
    )
    
    # Normalize scores to 0 - 100 range
    carbon_score = min(100, max(0, carbon_score))
    economic_pressure = min(100, max(0, economic_pressure))
    justice_score = min(100, max(0, justice_score))
    
    # Temperature trajectory
    temperature_traj, years = climate_api(start_year, end_year, location, policies)
    
    # Determining badge
    if carbon_score >= 85 and justice_score >= 85:      # Gold badge would require excellent performance in both carbon reduction and justice
        badge = "Gold"
    elif carbon_score >= 60 and justice_score >= 60:    # Silver badge would require good performance in both, while showcasing more space for improvement
        badge = "Silver"
    else:                                               # Bronze badge would be awarded for any other combination of scores, which requires significant improvement
        badge = "Bronze"
    
    # Policy summary generation
    summary_components = []
    if policies["carbonTaxRate"] > 80:
        summary_components.append("Employs aggressive carbon pricing")
    elif 80 >= policies["carbonTaxRate"] > 40:
        summary_components.append("Uses moderate carbon pricing")
    else: 
        summary_components.append("Has low carbon pricing")
        
    if policies["renewableSubsidy"] > 70:
        summary_components.append("strongly supports renewable energy")
    elif 70 >= policies["renewableSubsidy"] > 30:
        summary_components.append("moderately invests in renewables")
        
    if policies["fossilFuelPhaseout"] == "fast":
        summary_components.append("rapidly phases out fossil fuels")
    elif policies["fossilFuelPhaseout"] == "medium":
        summary_components.append("steadily reduces fossil fuel dependence")
        
    if policies["justiceLensStrength"] > 70:
        summary_components.append("prioritizes climate justice")
        
    if policies["adaptationInvestment"] > 7:
        summary_components.append("invests heavily in adaptation")
        
    if not summary_components:
        summary = "This policy takes a balanced approach to climate change mitigation and adaptation."
    else:
        summary = f"This policy {', '.join(summary_components[:-1])}"
        if len(summary_components) > 1:
            summary += f", and {summary_components[-1]}."
        else:
            summary += f"."
    
       # Ferched Policy name
    if policy_naming == "" or policy_naming == "None":
        policy_name = calculate_policy_name(policies)
    else:
        policy_name = policy_naming

    # Add description if provided
    new_description = ""
    if description == "":
        new_description = summary
    else:
        new_description = gemini_improver(policy_name ,description)
    
    # Suggested policy improvements generation
    suggested_policy = {}
    suggestion_name = ""
    
    ### Logic for suggesting improvements
    if carbon_score < 60:
        # The suggestions for improving a low carbon score
        suggested_policy = {
            "carbonTaxRate": min(200, policies["carbonTaxRate"] + 30),
            "renewableSubsidy": min(100, policies["renewableSubsidy"] + 20),
            "fossilFuelPhaseout": "fast",
        }
        suggestion_name = "Enhanced Climate Mitigation"
    elif economic_pressure > 70:
        # Suggestions for reducing economic pressure
        suggested_policy = {
            "carbonTaxRate": max(10, policies["carbonTaxRate"] - 20),
            "renewableSubsidy": min(100, policies["renewableSubsidy"] + 10),
            "adaptationInvestment": min(10, policies["adaptationInvestment"] + 1),
        }
        suggestion_name = "Economically Balanced Transition"
    elif justice_score < 60:
        # Suggestions for improving a low justice score
        suggested_policy = {
            "justiceLensStrength": min(100, policies["justiceLensStrength"] + 30),
            "educationCampaigns": min(100, policies["educationCampaigns"] + 20),
            "adaptationInvestment": min(10, policies["adaptationInvestment"] + 2),
        }
        suggestion_name = "Justice-Enhanced Climate Plan"
    else:
        # Balanced improvement
        suggested_policy = {
            "carbonTaxRate": min(200, policies["carbonTaxRate"] + 10),
            "renewableSubsidy": min(100, policies["renewableSubsidy"] + 10),
            "adaptationInvestment": min(10, policies["adaptationInvestment"] + 1),
        }
        suggestion_name = "Optimized Climate Strategy"
    
    # Fetches AI comments
    scores = {
        "carbon_score": round(carbon_score), 
        "justice_score": round(justice_score), 
        "economic_pressure": round(economic_pressure)
    }
    ai_comment = gemini_api(new_description, scores, location)
    
    # Output format
    results = {
        "policyName": policy_name,
        "description": new_description,
        "years": years,
        "temperatureTrajectory": temperature_traj,
        "carbonScore": round(carbon_score),
        "justiceScore": round(justice_score),
        "economicPressure": round(economic_pressure),
        "badge": badge,
        "suggestedPolicy": suggested_policy,
        "suggestedPolicyName": suggestion_name,
        "aiComment": ai_comment,
        "strength": analyze_policy_with_gemini(description, "strength"),
        "weakness": analyze_policy_with_gemini(description, "weakness"),
    }
    
    return results

def handle_simulation(input_data):
    """
    Purpose: Handles the simulation request. This is the main entry point for the backend when called from the frontend.

    Args:
        input_data: A dictionary containing the data sent from the
                   React frontend.

    Returns:
        A dictionary containing the results of the simulation.
    """
    required_fields = ["location", "startYear", "endYear", "policies"]
    for i in required_fields:
        if i not in input_data:
            print(f"Missing required field: {i}")
            return {"error": f"Missing required field: {i}"}
        
    required_policies = [
        "carbonTaxRate", "renewableSubsidy", "fossilFuelPhaseout", 
        "deforestationBan", "educationCampaigns", "greenJobsInitiative", 
        "industryRegulations", "justiceLensStrength", "adaptationInvestment", 
        "carbonCaptureRAndD"
    ]
        
    for p in required_policies:
        if p not in input_data["policies"]:
            print(f"Missing required policy setting: {p}")
            return {"error": f"Missing required policy setting: {p}"}
        
    # Run simulation
    results = calculate_results(input_data)
    return results

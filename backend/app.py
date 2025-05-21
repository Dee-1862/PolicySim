from flask import Flask, jsonify, request
from flask_cors import CORS
from cpdb_api import request as cpdb_request
from simulation_logic import handle_simulation

app = Flask(__name__)
CORS(app)  # Enable CORS to allow requests from the React frontend

@app.route('/api/policies', methods=['GET'])
def get_policies():
    """
    Returns a list of all climate policies, with optional filtering.
    """
    try:
        req = cpdb_request.Request()

        # Get query parameters from the request
        decision_date = request.args.get('decision_date')
        policy_status = request.args.get('policy_status')
        sector = request.args.get('sector')
        country_iso = request.args.get('country_iso')
        policy_instrument = request.args.get('policy_instrument')
        mitigation_area = request.args.get('mitigation_area')

        # Apply filters if 
        if country_iso:
            # Case-insensitive filter
            req.set_country(country_iso)
        if decision_date:
            req.set_decision_date(int(decision_date))
        if policy_status:
            req.set_policy_status(policy_status)
        if sector:
            # Handle multiple sectors if comma-separated
            for s in sector.split(','):
                req.add_sector(s.strip())
        if policy_instrument:
            # Handle multiple instruments if comma-separated
            for pi in policy_instrument.split(','):
                req.add_policy_instrument(pi.strip())
        if mitigation_area:
            # Handle multiple mitigation areas if comma-separated
            for ma in mitigation_area.split(','):
                req.add_mitigation_area(ma.strip())
        
        # Issue the request to get dataframe
        policies_df = req.issue()
        
        # Convert the DataFrame to a list of dictionaries
        policies_data = policies_df.to_dict(orient='records')
        return jsonify(policies_data)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/policy/<string:policy_id>', methods=['GET'])
def get_policy(policy_id):
    """
    Returns the details of a specific climate policy.
    
    Args:
        policy_id: The ID of the policy to retrieve.
    """
    try:
        # First get the policy from CPDB
        req = cpdb_request.Request()
        policies_df = req.issue()
        
        # Find the specific policy in the dataframe
        policy = policies_df[policies_df['policy_id'] == policy_id]
        
        # if policy.empty:
        #     return jsonify({'error': 'Policy not found'}), 404
        
        # Extract basic policy details from CPDB
        policy_data = policy.iloc[0].to_dict()
        
        # Now use the simulation logic to generate additional climate impact details
        # Create input data structure for handle_simulation
        # Dynamically set policy simulation parameters based on policy data
        description = str(policy_data.get("description", "")).lower()
        sector = str(policy_data.get("sector", "")).lower()
        policy_instrument = str(policy_data.get("policy_instrument", "")).lower()

        # Example of more dynamic/conditional logic for simulation parameters
        carbon_tax_rate = 50 if "carbon tax" in description else 20
        renewable_subsidy = 70 if "renewable" in sector else 30
        fossil_fuel_phaseout = "fast" if "phase out" in description else "medium"
        deforestation_ban = True
        education_campaigns = 80 if "education" in policy_instrument or "education" in description else 50
        green_jobs_initiative = 10 if "jobs" in description or "employment" in description else 5
        industry_regulations = "high" if "regulation" in policy_instrument else "medium"
        justice_lens_strength = 80 if "justice" in description else 60
        adaptation_investment = 10 if ("adaptation" in sector or "adaptation" in description) else 5
        carbon_capture_randd = 8 if "carbon capture" in description else 3

        sy = 0
        if policy_data.get("start_date"):
            sy = int(policy_data["start_date"]) 
        elif policy_data.get("decision_date"):
            sy = int(policy_data["decision_date"])
        else:
            sy = 2000


        input_data = {
            "policyName": policy_data.get("policy_name", ""),
            "description": policy_data.get("policy_description", ""),
            # "policy_status": policy_data.get("policy_status", "None"),
            # "policy_type": policy_data.get("policy_type", "None"),
            # "policy_instrument": policy_data.get("policy_instrument", "None"),
            # "sector": policy_data.get("sector", "None"),
            "location": policy_data.get("country", "Global"),
            "startYear":sy,
            "endYear": int(policy_data.get("end_date", 2100)) if policy_data.get("end_date") else 2100,
            "policies": {
            "carbonTaxRate": carbon_tax_rate,
            "renewableSubsidy": renewable_subsidy,
            "fossilFuelPhaseout": fossil_fuel_phaseout,
            "deforestationBan": deforestation_ban,
            "educationCampaigns": education_campaigns,
            "greenJobsInitiative": green_jobs_initiative,
            "industryRegulations": industry_regulations,
            "justiceLensStrength": justice_lens_strength,
            "adaptationInvestment": adaptation_investment,
            "carbonCaptureRAndD": carbon_capture_randd
            }
        }
        
        # Get simulation results
        simulation_results = handle_simulation(input_data)
        
        # Merge CPDB data with simulation results
        policy_data.update(simulation_results)
        return jsonify(policy_data)
        

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/simulate', methods=['POST'])
def simulate():
    """
    Handles policy simulation requests.
    This endpoint remains unchanged as requested.
    """
    try:
        input_data = request.get_json()  # Gets the JSON data
        if 'policyName' not in input_data:
            input_data['policyName'] = ''
        if 'description' not in input_data:
            input_data['description'] = ''
        results = handle_simulation(input_data)
        return jsonify(results)  # Convert the results to JSON
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
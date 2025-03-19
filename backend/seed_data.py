from app import create_app, db
from app.models.customer import Customer, Interaction
from datetime import datetime, timedelta
import random

def seed_database():
    app = create_app()
    with app.app_context():
        # Clear existing data
        print("Clearing existing data...")
        Interaction.query.delete()
        Customer.query.delete()
        db.session.commit()

        # Real-life company names
        companies = [
            'Microsoft Corporation', 'Amazon Web Services', 'IBM Global Services',
            'Accenture Solutions', 'Deloitte Consulting', 'Oracle Systems',
            'Salesforce Inc', 'SAP Technologies', 'Adobe Systems', 'Intel Corporation',
            'Cisco Systems', 'VMware Inc', 'Dell Technologies', 'HP Enterprise',
            'Red Hat Software'
        ]
        
        # Realistic interaction types with descriptions
        interaction_types = [
            'sales_call', 'product_demo', 'contract_negotiation', 
            'support_ticket', 'quarterly_review', 'consultation',
            'training_session', 'email_follow_up', 'site_visit',
            'virtual_meeting'
        ]
        
        # Customer status with weighted probabilities
        status_types = {
            'active': 0.4,
            'lead': 0.2,
            'prospect': 0.15,
            'churned': 0.1,
            'on_hold': 0.15
        }

        # Sample first names and last names for more realistic customer names
        first_names = [
            'James', 'Emma', 'Michael', 'Sarah', 'David', 'Lisa', 'Robert',
            'Jennifer', 'William', 'Elizabeth', 'Richard', 'Maria', 'John',
            'Patricia', 'Thomas', 'Linda', 'Mark', 'Susan', 'Steven', 'Karen'
        ]
        
        last_names = [
            'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia',
            'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez',
            'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore',
            'Jackson', 'Martin'
        ]

        # Sample interaction notes templates
        interaction_notes_templates = [
            "Discussed {} implementation timeline. Client interested in Q{} deployment.",
            "Presented {} pricing proposal. Decision expected within {} weeks.",
            "Resolved technical issue with {}. Follow-up scheduled for next week.",
            "Quarterly business review completed. Client satisfied with {} performance.",
            "Provided training on {} features. Team showed high engagement.",
            "Contract negotiation for {} services. Terms under legal review.",
            "Product demonstration of {}. Client expressed interest in additional features.",
            "Support ticket resolved: {} integration issue fixed.",
            "Site visit completed. Assessed {} infrastructure requirements.",
            "Virtual meeting to discuss {} upgrade options. Proposal to be sent."
        ]

        # Create 50 realistic customers
        customers = []
        print("Creating customers...")
        for i in range(50):
            company = random.choice(companies)
            domain = company.lower().replace(' ', '').replace(',', '').replace('.', '') + '.com'
            first_name = random.choice(first_names)
            last_name = random.choice(last_names)
            email = f"{first_name.lower()}.{last_name.lower()}@{domain}"
            
            status = random.choices(
                list(status_types.keys()),
                weights=list(status_types.values())
            )[0]

            customer = Customer(
                first_name=first_name,
                last_name=last_name,
                email=email,
                phone=f"+1-{random.randint(200,999)}-{random.randint(100,999)}-{random.randint(1000,9999)}",
                company=company,
                status=status
            )
            customers.append(customer)
            db.session.add(customer)

        db.session.commit()
        print("Added 50 customers successfully!")

        # Create 3-8 interactions for each customer with realistic patterns
        print("Creating interactions...")
        for customer in customers:
            num_interactions = random.randint(3, 8)
            # Sort interactions by date
            dates = sorted([
                datetime.now() - timedelta(days=random.randint(0, 365))
                for _ in range(num_interactions)
            ], reverse=True)
            
            for date in dates:
                interaction_type = random.choice(interaction_types)
                product_service = random.choice([
                    'Cloud Migration', 'Data Analytics', 'Security Services',
                    'Enterprise Software', 'Consulting Services', 'Infrastructure',
                    'Digital Transformation', 'AI Solutions', 'IoT Platform',
                    'Managed Services'
                ])
                
                note_template = random.choice(interaction_notes_templates)
                notes = note_template.format(
                    product_service,
                    random.choice(['1', '2', '3', '4']),  # Quarter
                    random.randint(2, 8)  # Weeks
                )

                interaction = Interaction(
                    customer_id=customer.id,
                    type=interaction_type,
                    notes=notes,
                    date=date
                )
                db.session.add(interaction)

        db.session.commit()
        print("Added interactions for all customers successfully!")
        print("Realistic sample data has been added to the database!")

if __name__ == '__main__':
    seed_database() 
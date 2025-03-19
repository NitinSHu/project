from app import create_app, db
from app.models.customer import Customer, Interaction
from datetime import datetime, timedelta
import random

def seed_database():
    app = create_app()
    with app.app_context():
        # Clear existing data
        Interaction.query.delete()
        Customer.query.delete()
        db.session.commit()

        # Sample data for random generation
        companies = [
            'Tech Corp', 'Digital Solutions', 'Innovate Inc', 'Future Systems',
            'Cloud Nine', 'Data Dynamics', 'Smart Solutions', 'Tech Giants',
            'Digital Dreams', 'Cyber Systems'
        ]
        
        interaction_types = ['email', 'call', 'meeting', 'video_call', 'site_visit']
        
        status_types = ['lead', 'prospect', 'customer', 'inactive', 'potential']

        # Create 20 sample customers
        customers = []
        for i in range(1, 21):
            customer = Customer(
                first_name=f'Customer{i}',
                last_name=f'Sample{i}',
                email=f'customer{i}@example.com',
                phone=f'{random.randint(100,999)}-{random.randint(100,999)}-{random.randint(1000,9999)}',
                company=random.choice(companies),
                status=random.choice(status_types)
            )
            customers.append(customer)
            db.session.add(customer)

        db.session.commit()
        print("Added 20 customers successfully!")

        # Create 2-3 interactions for each customer
        for customer in customers:
            num_interactions = random.randint(2, 3)
            for j in range(num_interactions):
                date = datetime.now() - timedelta(days=random.randint(0, 60))
                interaction = Interaction(
                    customer_id=customer.id,
                    type=random.choice(interaction_types),
                    notes=f'Sample interaction {j+1} for customer {customer.first_name}',
                    date=date
                )
                db.session.add(interaction)

        db.session.commit()
        print("Added interactions for all customers successfully!")
        print("Sample data has been added to the database!")

if __name__ == '__main__':
    seed_database() 
-- Insert test data for users table
INSERT INTO users (client_id, purchase_id, invest_id) VALUES 
('client_001', 'purchase_001', 'invest_001'),
('client_002', 'purchase_002', 'invest_002'),
('client_003', 'purchase_003', 'invest_003'),
('client_001', 'purchase_004', 'invest_004'),
('client_004', 'purchase_005', 'invest_005'),
('client_002', 'purchase_006', 'invest_006'),
('client_005', 'purchase_007', 'invest_007'),
('client_003', 'purchase_008', 'invest_008'),
('client_006', 'purchase_009', 'invest_009'),
('client_001', 'purchase_010', 'invest_010');

-- Insert test data for user_rules table
INSERT INTO user_rules (client_id, description, min_threshold, max_threshold, percentage) VALUES 
('client_001', 'Aggressive investment strategy for high returns', 1000.00, 5000.00, 0.75),
('client_001', 'Conservative backup rule for large amounts', 5000.00, 50000.00, 0.25),
('client_002', 'Moderate balanced portfolio allocation', 500.00, 10000.00, 0.50),
('client_002', 'High-risk high-reward for excess funds', 10000.00, 100000.00, 0.80),
('client_003', 'Conservative low-risk investment', 100.00, 2000.00, 0.15),
('client_003', 'Moderate growth strategy', 2000.00, 15000.00, 0.45),
('client_004', 'Aggressive growth for young investor', 250.00, 25000.00, 0.85),
('client_005', 'Retirement planning conservative approach', 1000.00, 20000.00, 0.30),
('client_005', 'Emergency fund allocation rule', 20000.00, 75000.00, 0.10),
('client_006', 'Balanced diversified investment strategy', 750.00, 12000.00, 0.60);
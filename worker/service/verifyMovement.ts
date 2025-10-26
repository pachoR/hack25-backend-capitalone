import { query } from '../../src/util/dbClient';
import { getPurchaseById } from '../../src/services/purchaseService';
import { getAllUserRules } from '../../src/services/userService';
import { createTransfer} from '../../src/services/transferService';

const SAVING_ACCOUNT = '68fc6e5d9683f20dd51a4111'

const getAllOngoingMovements = async () => {
    const res = await query('SELECT * FROM users WHERE exec_status = $1', ['ON_GOING']);
    return res.rows;
}

export const verifyAndUpdateMovements = async () => {
    try {
        console.log('Verifying ongoing movements...');
        const ongoingMovements = await getAllOngoingMovements();
        if (ongoingMovements.length === 0) {
            console.log('No ongoing movements found.');
            return;
        }

        for (const movement of ongoingMovements) {
            console.log(`Verifying movement for client_id: ${movement.client_id}, purchase_id: ${movement.purchase_id}`);
            const status = await checkMovementStatus(movement.purchase_id);
            switch (status) {
                case 'pending':
                    console.log(`Movement pending for purchase_id: ${movement.purchase_id}`);
                    break;
                case 'executed':
                    await handleExecutedMovement(movement);
                    break;
                case 'cancelled':
                    await handleCancelledMovement(movement);
                    break;
            }
        }
    } catch (error) {
        console.error('Error verifying movements:', error);
    }
};

export const handleCancelledMovement = async (movement: any) => {
    try {
        await query(
            'UPDATE users SET exec_status = $1 WHERE purchase_id = $2',
            ['KILLED', movement.purchase_id]
        );
        console.log(`Movement with purchase_id: ${movement.purchase_id} marked as KILLED.`);
    } catch (error) {
        console.error(`Error updating movement status for purchase_id: ${movement.purchase_id}`, error);
    }
};

export const handleExecutedMovement = async (movement: any) => {
    try {
        const rules = await getAllUserRules(movement.client_id);
        const purchase = await getPurchaseById(movement.purchase_id);
        const purchaseAmount = purchase?.amount || 0;
        let applicableRule = rules.find((rule) => 
            purchaseAmount >= rule.min_threshold && purchaseAmount <= rule.max_threshold
        );
        if (!applicableRule) {
            console.log(`No applicable rule found for client_id: ${movement.client_id} with purchase amount: ${purchaseAmount}`);
        }else {
            const transfer = await createTransfer(movement.client_id,{
                amount: (purchaseAmount * applicableRule.percentage) / 100,
                payee_id: SAVING_ACCOUNT,
                medium: 'balance'
            });
            console.log(`Transfer created: ${JSON.stringify(transfer)}`);
        }
        console.log('Updating movement status to EXEC...');
        
        await query(
            'UPDATE users SET exec_status = $1 WHERE purchase_id = $2',
            ['EXEC', movement.purchase_id]
        );
        console.log(`Movement with purchase_id: ${movement.purchase_id} marked as EXEC.`);
    } catch (error) {
        console.error(`Error updating movement status for client_id: ${movement.client_id}`, error);
    }
};  

export const checkMovementStatus = async (purchase_id: string) => {
    const purchase = await getPurchaseById(purchase_id);
    if (purchase) {
        console.log(`Purchase found: ${JSON.stringify(purchase.status)}`);
        return purchase.status;
    } else {
        console.log(`Purchase not found for ID: ${purchase_id}`);
        return null;
    }
}
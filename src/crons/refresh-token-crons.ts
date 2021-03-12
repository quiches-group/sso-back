import { CronJob } from 'cron';
import moment from 'moment';
import RefreshTokenRepository from '../repositories/RefreshTokenRepository';
import { RefreshToken } from '../models/RefreshToken';

const deleteAllExpiredOrUsedRefreshTokens = async () => {
    const refreshTokens = await RefreshTokenRepository.findManyBy({});

    refreshTokens.forEach((token: RefreshToken) => {
        if (!token.active || token.expirationDate < moment().unix()) {
            RefreshTokenRepository.deleteOnyBy({ _id: token._id });
        }
    });
};

export default new CronJob('00 00 00 * * *', () => deleteAllExpiredOrUsedRefreshTokens());

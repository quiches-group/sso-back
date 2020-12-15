import BaseRepository from './BaseRepository';
import { RefreshToken, RefreshTokenModel } from '../models/RefreshToken';

class RefreshTokenRepository extends BaseRepository<RefreshToken> {
    constructor() {
        super(RefreshTokenModel);
    }
}

export default new RefreshTokenRepository();
